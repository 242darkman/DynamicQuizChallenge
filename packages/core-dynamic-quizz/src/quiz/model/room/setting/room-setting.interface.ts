import { RoomEntity } from 'src/quiz/model/room/room.entity';

export interface RoomSettingInterface {
  id: string;
  theme: string;
  level: string;
  numberOfQuestions: number;
  numberOfRounds: number;
  room: RoomEntity;
}
