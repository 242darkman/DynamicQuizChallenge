import { RoomInterface } from 'src/quiz/model/room/room.interface';
import { UserInterface } from 'src/user/model/user.interface';

export interface JoinedRoomInterface {
  id?: number;
  socketId: string;
  user: UserInterface;
  room: RoomInterface;
}
