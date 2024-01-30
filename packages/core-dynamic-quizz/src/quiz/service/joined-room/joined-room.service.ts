import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedRoomEntity } from 'src/quiz/model/joined-room/joined-room.entity';
import { JoinedRoomInterface } from 'src/quiz/model/joined-room/joined-room.interface';
import { RoomInterface } from 'src/quiz/model/room/room.interface';
import { UserInterface } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class JoinedRoomService {
  constructor(
    @InjectRepository(JoinedRoomEntity)
    private readonly joinedRoomRepository: Repository<JoinedRoomEntity>,
  ) {}

  async create(joinedRoom: JoinedRoomInterface): Promise<JoinedRoomInterface> {
    return this.joinedRoomRepository.save(joinedRoom);
  }

  async findByUser(user: UserInterface): Promise<JoinedRoomInterface[]> {
    return this.joinedRoomRepository.find({ where: { user } });
  }

  async findByRoom(room: RoomInterface): Promise<JoinedRoomInterface[]> {
    return this.joinedRoomRepository.find({ where: { room } });
  }

  async deleteBySocketId(socketId: string) {
    return this.joinedRoomRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.joinedRoomRepository.createQueryBuilder().delete().execute();
  }
}
