import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ConnectedUserEntity } from 'src/quiz/model/connected-user/connected-user.entity';
import { JoinedRoomEntity } from 'src/quiz/model/joined-room/joined-room.entity';
import { RoomEntity } from 'src/quiz/model/room/room.entity';
import { RankingEntity } from 'src/quiz/model/ranking/ranking';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @ManyToMany(() => RoomEntity, (room) => room.users)
  rooms: RoomEntity[];

  @OneToMany(() => ConnectedUserEntity, (connection) => connection.user)
  connections: ConnectedUserEntity[];

  @OneToMany(() => JoinedRoomEntity, (joinedRoom) => joinedRoom.room)
  joinedRooms: JoinedRoomEntity[];

  @OneToMany(() => RankingEntity, (ranking) => ranking.user)
  ranking: RankingEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();
  }
}
