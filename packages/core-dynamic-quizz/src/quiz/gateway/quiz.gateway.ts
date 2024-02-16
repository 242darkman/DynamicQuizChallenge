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
import { RoomService } from 'src/quiz/service/room/room.service';
import { UserInterface } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
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
    private connectedUserService: ConnectedUserService,
    private joinedRoomService: JoinedRoomService,
  ) {}

  async afterInit() {
    this.logger.debug(`Gateway ${QuizGateway.name} websockets initialized. `);

    await this.redisClient.del('rooms');
    await this.redisClient.del('connectedUsers');
    await this.redisClient.del('joinedRooms');
    await this.connectedUserService.deleteAll();
    await this.joinedRoomService.deleteAll();
  }

  async retrieveAndCacheUser(token, cacheKey) {
    const decodedToken = await this.authService.verifyJwt(token);
    const user = await this.userService.getOne(decodedToken.user.id);
    await this.redisClient.set(cacheKey, JSON.stringify(user), 'EX', 3600); // Expire après 1 heure
    return user;
  }

  async handleConnection(client: Socket) {
    this.activeSockets.add(client.id);
    const { sockets } = this.server.sockets;
    this.logger.debug(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);

    try {
      const token = client.handshake.headers.authorization;
      const cacheKey = `user:${token}`;
      const cachedUser = await this.redisClient.get(cacheKey);
      const user: UserInterface = cachedUser
        ? JSON.parse(cachedUser)
        : await this.retrieveAndCacheUser(token, cacheKey);

      if (!user) {
        this.disconnect(client);
      } else {
        client.data.user = user;
        await this.cacheConnectedUser(client.id, user);
        this.emitUserRooms(client, user.id);
      }
    } catch (error) {
      this.logger.debug(
        `Disconnecting socket with id: ${client?.id} due to error: ${error.message}`,
      );
      this.disconnect(client);
    }
  }

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

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomInterface) {
    const createdRoom: RoomInterface = await this.roomService.createRoom(
      room,
      socket.data.user,
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

    this.server.to(socket.id).emit('roomCreated', createdRoom);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room: RoomInterface) {
    // Sauvegarder la connexion dans le salon
    await this.joinedRoomService.create({
      socketId: socket.id,
      user: socket.data.user,
      room,
    });
    // Envoi des derniers messages du salon à l'utilisateur
    await this.server
      .to(socket.id)
      .emit('quiz', [{ message: `Welcome to the room ${room.name} !` }]);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket) {
    // supprime la connexion du salon rejoint
    await this.joinedRoomService.deleteBySocketId(socket.id);
  }

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
    ); // Expire après 1 heure
  }

  private async emitUserRooms(socket: Socket, userId: string) {
    const cacheKey = `rooms:user:${userId}`;
    const cachedRooms = await this.redisClient.get(cacheKey);
    const rooms = cachedRooms
      ? JSON.parse(cachedRooms)
      : await this.roomService.getRoomsForUser(userId, { page: 1, limit: 10 });
    await this.redisClient.set(cacheKey, JSON.stringify(rooms), 'EX', 3600); // Expire après 1 heure
    rooms.meta.currentPage = rooms.meta.currentPage - 1;
    this.server.to(socket.id).emit('rooms', rooms);
  }

  private async invalidateCachedRoomsForUser(userId: string) {
    const cacheKey = `rooms:user:${userId}`;
    await this.redisClient.del(cacheKey);
  }

  private async invalidateCacheForUserDisconnect(userId: string) {
    const cacheKey = `connectedUsers:${userId}`;
    await this.redisClient.del(cacheKey);
    // Invalider également le cache des salles de cet utilisateur
    await this.invalidateCachedRoomsForUser(userId);
  }
}
