import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Logger, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { ConnectedUserInterface } from 'src/quiz/model/connected-user/connected-user.interface';
import { ConnectedUserService } from 'src/quiz/service/connected-user/connected-user.service';
import { JoinedRoomService } from 'src/quiz/service/joined-room/joined-room.service';
import { RoomInterface } from 'src/quiz/model/room/room.interface';
import { RoomSettingInterface } from 'src/quiz/model/room/setting/room-setting.interface';
import { RoomService } from 'src/quiz/service/room/room.service';
import { UserInterface } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';
import get from 'lodash/get';
import { OpenAIService } from 'src/quiz/service/openai/openai.service';
import { QuizService } from '../service/quiz/quiz.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  },
})
export class QuizGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  public readonly logger = new Logger(QuizGateway.name);
  private activeSockets = new Set<string>();

  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
    private quizService: QuizService,
    private connectedUserService: ConnectedUserService,
    private joinedRoomService: JoinedRoomService,
    private openAIService: OpenAIService,
  ) {}

  /**
   * Perform cleanup tasks after the initialization of the gateway.
   *
   * @return {Promise<void>} Promise that resolves after all cleanup tasks are complete
   */
  async afterInit() {
    this.logger.debug(`Gateway ${QuizGateway.name} websockets initialized. `);

    await this.redisClient.del('rooms');
    await this.redisClient.del('connectedUsers');
    await this.redisClient.del('joinedRooms');
    await this.connectedUserService.deleteAll();
    await this.joinedRoomService.deleteAll();
    await this.quizService.deleteAll();
  }

  /**
   * Asynchronously retrieves user data, caches it, and returns the user object.
   *
   * @param {type} token - The user's token
   * @param {type} cacheKey - The key for caching the user data
   * @return {type} user - The user object
   */
  async retrieveAndCacheUser(token, cacheKey) {
    const decodedToken = await this.authService.verifyJwt(token);
    const user = await this.userService.getOne(decodedToken.user.id);
    await this.redisClient.set(cacheKey, JSON.stringify(user), 'EX', 3600); // Expire après 1 heure
    return user;
  }

  /**
   * Handle a new client connection.
   *
   * @param {Socket} client - The client socket
   * @return {Promise<void>} A promise that resolves when the handling is complete
   */
  async handleConnection(client: Socket) {
    this.activeSockets.add(client.id);
    const { sockets } = this.server.sockets;
    this.logger.debug(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);

    try {
      const authHeader = client.handshake.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        this.logger.debug('No token provided, customer disconnected.');
        this.disconnect(client);
        return;
      }

      const cacheKey = `user:${token}`;
      const cachedUser = await this.redisClient.get(cacheKey);
      const user: UserInterface = cachedUser
        ? JSON.parse(cachedUser)
        : await this.retrieveAndCacheUser(token, cacheKey);

      if (!user) {
        this.disconnect(client);
        return;
      }

      client.data.user = user;
      await this.cacheConnectedUser(client.id, user);
      this.emitUserRooms(client, user);
    } catch (error) {
      this.logger.debug(
        `Disconnecting socket with id: ${client?.id} due to error: ${error.message}`,
      );
      this.disconnect(client);
    }
  }

  /**
   * Handles the disconnection of a client socket.
   *
   * @param {Socket} client - the client socket being disconnected
   * @return {Promise<void>} a promise that resolves once the disconnection process is complete
   */
  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    if (this.activeSockets.has(client.id)) {
      this.activeSockets.delete(client.id);
      await this.connectedUserService.deleteBySocketId(client.id);
      await this.invalidateCacheForUserDisconnect(client.data.user.id);
      client.disconnect();
    } else {
      this.logger.error(
        `Socket with id: ${client.id} was not tracked as active.`,
      );
    }
  }

  /**
   * Disconnects the given socket.
   *
   * @param {Socket} socket - the socket to disconnect
   * @return {void}
   */
  private disconnect(socket: Socket) {
    if (!socket) {
      this.logger.error('Socket is undefined, cannot proceed with disconnect.');
      return;
    }

    try {
      socket.emit('Error', new UnauthorizedException());
      socket.disconnect();
    } catch (error) {
      this.logger.error(
        `Error disconnecting socket with id: ${socket.id}: ${error.message}`,
      );
    }
  }

  /**
   * Function to create a room with given room data and notify connected users.
   *
   * @param {Socket} socket - the socket object
   * @param {{ room: RoomInterface; settings: RoomSettingInterface }} roomData - the room data object
   * @return {Promise<void>} a promise that resolves when the room is created and users are notified
   */
  @SubscribeMessage('createRoom')
  async onCreateRoom(
    client: Socket,
    roomData: { room: RoomInterface; settings: RoomSettingInterface },
  ) {
    const clientId = get(client, 'id');

    try {
      const { room, settings } = roomData;
      const roomCreator = client.data.user;

      if (!room || !settings) {
        this.server.to(clientId).emit('createRoomResponse', {
          success: false,
          message: `Données ou paramètres manquants pour la création du salon.`,
        });
        return;
      }

      const createdRoom: RoomInterface =
        await this.roomService.createRoomWithSettings(
          room,
          settings,
          roomCreator,
        );

      for (const user of createdRoom.users) {
        const connections: ConnectedUserInterface[] =
          await this.connectedUserService.findByUser(user);
        const rooms = await this.roomService.getRoomsForUser(user.id, {
          page: 1,
          limit: 10,
        });
        rooms.meta.currentPage = rooms.meta.currentPage - 1;
        for (const connection of connections) {
          await this.server.to(connection.socketId).emit('rooms', rooms);
        }
      }

      // Gestion de la réponse en cas de succès
      this.server
        .to(clientId)
        .emit('createRoomResponse', { success: true, room: createdRoom });
    } catch (error) {
      this.logger.error(`Error when creating room : ${error.message}`);
      this.server.to(clientId).emit('createRoomResponse', {
        success: false,
        message: `Erreur lors de la création de la salle : ${error.message}`,
      });
    }
  }

  /**
   * Méthode pour générer les questions
   * @param client
   * @param gameConfig
   */
  @SubscribeMessage('generateQuestionWithParams')
  async generateQuestionWithParams(
    client: Socket,
    gameConfig: { theme: string; level: string; numberOfQuestions: number },
  ) {
    const { theme, numberOfQuestions, level } = gameConfig;

    try {
      const response = await this.openAIService.generateQuestions(
        theme,
        level,
        numberOfQuestions,
      );
      client.emit('response', response);
      client.broadcast.emit('response', response);
      this.logger.debug(`la réponse du serveur :`, response);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la tentative de récupération des questions : ${error.message}`,
      );
    }
  }

  @SubscribeMessage('generateHint')
  async generateHint(client: Socket, question: string) {
    try {
      const hint = await this.openAIService.generateHint(question);

      this.server.to(client.id).emit('onGenerateHintResponse', {
        success: true,
        hint,
      });
    } catch (error) {
      this.logger.error(
        `Erreur lors de la tentative de récupération des indices : ${error.message}`,
      );
    }
  }

  @SubscribeMessage('socketError')
  async socketError(client: Socket) {
    try {
      await this.joinedRoomService.deleteAll();
      await this.quizService.deleteAll();
      this.logger.debug(client.id);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la suppression dans la join et ranking : ${error.message}`,
      );
    }
  }

  /**
   * Handle the event when a user joins a room.
   *
   * @param {Socket} socket - The socket object
   * @param {RoomInterface} room - The room interface
   * @return {Promise<void>} A promise that resolves when the function completes
   */
  @SubscribeMessage('joinRoom')
  async onJoinRoom(
    client: Socket,
    { identifier, password }: { identifier: string; password?: string },
  ) {
    try {
      const user: UserInterface = client.data.user;
      const room: RoomInterface = await this.roomService.joinRoom(
        identifier,
        user,
        password,
      );

      await this.joinedRoomService.create({
        socketId: client.id,
        user,
        room,
      });

      this.server.to(client.id).emit('updateRoomUsers', {
        success: true,
        room,
      });

      this.logger.log(`User ${user.id} joined room ${room.id}`);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la tentative de rejoindre une salle : ${error.message}`,
      );
      this.server.to(client.id).emit('error', {
        success: false,
        message:
          "Oups ! Quelque chose s'est mal passé. Veuillez réessayer plus tard. 🤷‍♂️",
      });
    }
  }

  /**
   * Récupérer la liste des joueurs sur la page d'attente
   * @param client
   */
  @SubscribeMessage('getAllParticipantsInJoinedRooms')
  async getAllParticipantsInJoinedRooms(client: Socket) {
    try {
      const participants = await this.joinedRoomService.findAll();

      client.emit('allParticipants', participants);
      client.broadcast.emit('updateJoinedRooms', participants);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la récupération des salles jointes : ${error.message}`,
      );
    }
  }

  /**
   * Récupérer la liste des joueurs sur la page d'attente
   * @param client
   */
  @SubscribeMessage('getRanking')
  async getRanking(client: Socket) {
    try {
      const ranking = await this.quizService.findAll();

      client.emit('finalRanking', ranking);
      client.broadcast.emit('updateFinalRanking', ranking);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la récupération des salles jointes : ${error.message}`,
      );
    }
  }

  /**
   * Méthode pour enregistre le score
   * @param client
   * @param totalScore
   */
  @SubscribeMessage('createRanking')
  async ranking(client: Socket, score: number) {
    try {
      const user: UserInterface = client.data.user;
      await this.quizService.createRanking(user, score);
    } catch (error) {
      this.logger.error(`Erreur lors du calcul de score : ${error.message}`);
    }
  }

  /**
   * Rédiriger tous les participants
   */
  @SubscribeMessage('startGame')
  startGame(client: Socket) {
    client.emit('redirectToGamePage');
    client.broadcast.emit('redirectToGamePage');
  }

  /**
   * A description of the entire function.
   *
   * @param {Socket} socket - description of parameter
   * @return {Promise<void>} description of return value
   */
  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(client: Socket) {
    try {
      await this.joinedRoomService.deleteBySocketId(client.id);
      this.server.to(client.id).emit('leaveRoomResponse', {
        success: true,
        message: `Partir déjà ? J'espère que le score du gagnant ne vous a pas poussé à chercher refuge en ermite ! Tous ont besoin d'une pause pour rire et se reposer. Revenez vite pour plus d'aventures et moins d'erreurs stratégiques. À bientôt ! 😉`,
      });
    } catch (error) {
      this.server.to(client.id).emit('leaveRoomResponse', {
        success: false,
        message: `Erreur lors de la suppression de la connexion : ${error.message}`,
      });
    }
  }

  /**
   * Cache the connected user with the provided socket ID.
   *
   * @param {string} socketId - The ID of the socket
   * @param {UserInterface} user - The user to be cached
   * @return {Promise<void>} A Promise that resolves once the user is cached
   */
  private async cacheConnectedUser(socketId: string, user: UserInterface) {
    const cacheKey = `connectedUsers:${user.id}`;
    const existing = await this.redisClient.get(cacheKey);
    const connections = existing ? JSON.parse(existing) : [];
    connections.push(socketId);
    await this.redisClient.set(
      cacheKey,
      JSON.stringify(connections),
      'EX',
      3600,
    );
  }

  /**
   * Emit rooms to a user's socket after retrieving them from cache or database, and set a cache expiration time.
   *
   * @param {Socket} socket - the socket to emit the rooms to
   * @param {string} userId - the ID of the user
   * @return {Promise<void>} a promise that resolves when the rooms are emitted
   */
  private async emitUserRooms(socket: Socket, user: UserInterface) {
    const userId = get(user, 'id');
    const cacheKey = `rooms:user:${userId}`;
    const cachedRooms = await this.redisClient.get(cacheKey);
    const rooms = cachedRooms
      ? JSON.parse(cachedRooms)
      : await this.roomService.getRoomsForUser(userId, { page: 1, limit: 10 });
    await this.redisClient.set(cacheKey, JSON.stringify(rooms), 'EX', 3600);
    rooms.meta.currentPage = rooms.meta.currentPage - 1;
    await this.connectedUserService.create({ socketId: socket.id, user });
    this.server.to(socket.id).emit('rooms', rooms);
  }

  /**
   * Invalidate cached rooms for a specific user.
   *
   * @param {string} userId - the ID of the user
   * @return {Promise<void>} a Promise that resolves once the cached rooms are invalidated
   */
  private async invalidateCachedRoomsForUser(userId: string) {
    const cacheKey = `rooms:user:${userId}`;
    await this.redisClient.del(cacheKey);
  }

  /**
   * Invalidates the cache for a user upon disconnection.
   *
   * @param {string} userId - the ID of the user to invalidate the cache for
   * @return {Promise<void>} a promise that resolves when the cache invalidation is complete
   */
  private async invalidateCacheForUserDisconnect(userId: string) {
    const cacheKey = `connectedUsers:${userId}`;
    await this.redisClient.del(cacheKey);
    await this.invalidateCachedRoomsForUser(userId);
  }
}
