import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RoomEntity } from 'src/quiz/model/room/room.entity';
import { SubjectEntity } from 'src/quiz/model/subject/subject.entity';

@Entity()
export class QuizEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => SubjectEntity)
  @JoinTable()
  subjects: SubjectEntity[];

  @Column({
    type: 'enum',
    enum: ['easy', 'medium', 'hard', 'mixed'],
    default: 'medium',
  })
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';

  @Column({ default: false })
  randomizeSubjects: boolean;

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
