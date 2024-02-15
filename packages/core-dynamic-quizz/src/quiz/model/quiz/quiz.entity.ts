import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RoomEntity } from 'src/quiz/model/room/room.entity';

@Entity()
export class QuizEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['easy', 'medium', 'hard', 'mixed'],
    default: 'medium',
  })
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';

  @ManyToOne(() => RoomEntity, (room) => room.quiz)
  @JoinTable()
  room: RoomEntity;

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ nullable: true })
  score: number;

  @Column({ default: 10 })
  numberOfQuestions: number;

  @Column({ nullable: true })
  numberOfRounds: number;
}
