import { UserInterface } from 'src/user/model/user.interface';

export interface ConnectedUserInterface {
  id?: number;
  socketId: string;
  user: UserInterface;
}
