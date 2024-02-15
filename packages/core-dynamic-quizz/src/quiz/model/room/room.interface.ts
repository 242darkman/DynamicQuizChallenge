import { UserInterface } from 'src/user/model/user.interface';

export interface RoomInterface {
  id: string;
  name: string;
  description?: string;
  users: UserInterface[];
  isPrivate: boolean;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
}
