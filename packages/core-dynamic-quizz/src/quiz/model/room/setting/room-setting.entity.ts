import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RoomEntity } from 'src/quiz/model/room/room.entity';

@Entity()
export class RoomSettingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  theme: string;

  @Column()
  level: string;

  @Column()
  numberOfQuestions: number;

  @Column()
  numberOfRounds: number;

  @OneToOne(() => RoomEntity, (room) => room.settings)
  @JoinColumn()
  room: RoomEntity;
}
