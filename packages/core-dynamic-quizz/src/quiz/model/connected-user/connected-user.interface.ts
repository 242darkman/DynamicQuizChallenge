import { UserInterface } from 'src/user/model/user.interface';

export interface ConnectedUserInterface {
  id?: string;
  socketId: string;
  user: UserInterface;
}
