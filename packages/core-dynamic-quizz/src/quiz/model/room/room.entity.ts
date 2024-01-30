import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { JoinedRoomEntity } from 'src/quiz/model/joined-room/joined-room.entity';
import { QuizEntity } from 'src/quiz/model/quiz/quiz.entity';
import { UserEntity } from 'src/user/model/user.entity';

@Entity()
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(() => JoinedRoomEntity, (joinedRoom) => joinedRoom.room)
  joinedUsers: JoinedRoomEntity[];

  @OneToMany(() => QuizEntity, (quiz) => quiz.room)
  quiz: QuizEntity[];

  @Column({ default: true })
  isPrivate: boolean;

  @Column({ nullable: true })
  password?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
