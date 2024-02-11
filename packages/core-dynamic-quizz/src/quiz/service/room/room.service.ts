import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { RoomEntity } from 'src/quiz/model/room/room.entity';
import { RoomInterface } from 'src/quiz/model/room/room.interface';
import { UserInterface } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/model/user.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    private readonly authService: AuthService,
  ) {}

  /**
   * Création  d'une salle
   * @param roomData 
   * @param creator 
   * @param isPrivate 
   * @param password 
   * @returns 
   */


  async createRoom(name : string, password:string){
    console.log('name est ', name);
    console.log('password est ', password);
    return name


  }
  // async createRoom(
  //   roomData: RoomInterface,
  //   creator: UserInterface,
  //   isPrivate: boolean,
  //   password?: string,
  // ): Promise<RoomInterface> {
  //   console.log("Début de l'exécution de createRoom");
  //   const newRoom = new RoomEntity();
  //   Object.assign(newRoom, roomData);
  //   newRoom.isPrivate = isPrivate;
  //   if (isPrivate && password) {
  //     newRoom.password = await this.authService.hashPassword(password);
  //   }
  //   newRoom.users = [creator as UserEntity];
  //   console.log("Fin de l'exécution de createRoom");
  //   return this.roomRepository.save(newRoom);
  // }

  async joinRoom(
    roomId: number,
    user: UserInterface,
    password?: string,
  ): Promise<RoomInterface> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['users'],
    });

    if (!room) {
      throw new Error('Room not found');
    }

    if (room.isPrivate) {
      if (
        !password ||
        !(await this.authService.comparePasswords(password, room.password))
      ) {
        throw new Error('Invalid password');
      }
    }

    room.users.push(user as UserEntity);
    return this.roomRepository.save(room);
  }

  async getRoomsForUser(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<RoomInterface>> {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('room.users', 'all_users')
      .orderBy('room.updated_at', 'DESC');

    return paginate(query, options);
  }
}
