import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from 'src/user/model/user.entity';

@Entity()
export class RankingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.ranking)
  @JoinColumn()
  user: UserEntity;

  @Column()
  score: number;
}
