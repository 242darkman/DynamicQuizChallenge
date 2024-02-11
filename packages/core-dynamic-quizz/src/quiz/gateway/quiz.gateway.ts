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

@WebSocketGateway({ cors: true })
export class QuizGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  public readonly logger = new Logger(QuizGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
    private connectedUserService: ConnectedUserService,
    private joinedRoomService: JoinedRoomService,
  ) {}

  async afterInit() {
    this.logger.log(`Gateway ${QuizGateway.name} initialized`);
    await this.connectedUserService.deleteAll();
    await this.joinedRoomService.deleteAll();
  }
  async handleConnection(client: any, socket: Socket) {
    const { sockets } = this.server.sockets;
    this.logger.debug(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);

    /*try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: UserInterface = await this.userService.getOne(
        decodedToken.user.id,
      );

      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        const rooms = await this.roomService.getRoomsForUser(user.id, {
          page: 1,
          limit: 10,
        });
        rooms.meta.currentPage = rooms.meta.currentPage - 1;
        // Sauvegarder la connexion à la base de données
        await this.connectedUserService.create({ socketId: socket.id, user });
        // N'émet des salles que vers le client connecté spécifique
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this.disconnect(socket);
    }*/
  }
  async handleDisconnect(socket: Socket) {
    // supprimer la connexion de la base de données
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  // @SubscribeMessage('createRoom')
  // async onCreateRoom(
  //   socket: Socket,
  //   room: RoomInterface,
  //   isPrivate: boolean,
  //   password?: string,
  // ) {
  //   console.log("Début de l'exécution de onCreateRoom");
  //   const createdRoom: RoomInterface = await this.roomService.createRoom(
  //     room,
  //     socket.data.user,
  //     isPrivate,
  //     password,
  //   );

  //   for (const user of createdRoom.users) {
  //     const connections: ConnectedUserInterface[] =
  //       await this.connectedUserService.findByUser(user);
  //     const rooms = await this.roomService.getRoomsForUser(user.id, {
  //       page: 1,
  //       limit: 10,
  //     });
  //     rooms.meta.currentPage = rooms.meta.currentPage - 1;
  //     for (const connection of connections) {
  //       await this.server.to(connection.socketId).emit('rooms', rooms);
  //     }
  //   }
  //   console.log("Fin de l'exécution de onCreateRoom");
  // }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room: RoomInterface) {
    // Save Connection to Room
    //await this.joinedRoomService.create({ socketId: socket.id, user: socket.data.user, room });
    // Send last messages from Room to User
    await this.server
      .to(socket.id)
      .emit('quiz', [{ message: `Welcome to the room ${room.name} !` }]);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket) {
    // remove connection from JoinedRooms
    await this.joinedRoomService.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('message')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMessage(client: any, payload: any): string {
    return `Hello world !, this is the ${QuizGateway.name}`;
  }
}
