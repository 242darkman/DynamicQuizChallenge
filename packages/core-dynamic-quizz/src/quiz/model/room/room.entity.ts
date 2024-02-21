import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { JoinedRoomEntity } from 'src/quiz/model/joined-room/joined-room.entity';
import { RoomSettingEntity } from 'src/quiz/model/room/setting/room-setting.entity';
import { UserEntity } from 'src/user/model/user.entity';

@Entity()
export class RoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(() => JoinedRoomEntity, (joinedRoom) => joinedRoom.room)
  joinedUsers: JoinedRoomEntity[];

  @Column({ default: true })
  isPrivate: boolean;

  @Column({ nullable: true })
  password?: string;

  @OneToOne(() => RoomSettingEntity, (settings) => settings.room, {
    cascade: true,
  })
  settings: RoomSettingEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
