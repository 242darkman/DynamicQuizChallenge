import { UserInterface } from 'src/user/model/user.interface';

export interface RankingInterface {
  id?: string;
  user: UserInterface;
  score: Number;
}