import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { RoomEntity } from 'src/quiz/model/room/room.entity';
import { RoomSettingEntity } from 'src/quiz/model/room/setting/room-setting.entity';
import { RoomInterface } from 'src/quiz/model/room/room.interface';
import { RoomSettingInterface } from 'src/quiz/model/room/setting/room-setting.interface';
import { UserInterface } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/model/user.entity';
import get from 'lodash/get';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(RoomSettingEntity)
    private readonly roomSettingRepository: Repository<RoomSettingEntity>,
    private readonly authService: AuthService,
  ) {}

  /**
   * Create a new room with settings.
   *
   * @param {RoomInterface} roomData - the data for the room
   * @param {RoomSettingInterface} settingsData - the settings for the room
   * @param {UserInterface} creator - the user creating the room
   * @return {Promise<RoomInterface>} the newly created room
   */
  async createRoomWithSettings(
    roomData: RoomInterface,
    settingsData: RoomSettingInterface,
    creator: UserInterface,
  ): Promise<RoomInterface | null> {
    // Validation of key data
    if (!roomData || !settingsData || !creator) {
      console.error('Room data, parameters or creator are missing.');
      return null; // Returns null to indicate failure due to invalid data.
    }

    const password = get(roomData, 'password');
    const isPrivate = get(roomData, 'isPrivate');
    const newRoom = this.roomRepository.create(roomData);

    // Conditionally hash the password if the room is private and a password is provided.
    const hashedPassword =
      isPrivate && password
        ? await this.authService.hashPassword(password)
        : null;
    if (hashedPassword) {
      newRoom.password = hashedPassword;
    }

    newRoom.users = [creator as UserEntity];

    // Save the room
    const savedRoom = await this.roomRepository.save(newRoom);

    // Create and associate room parameters
    const newRoomSetting = this.roomSettingRepository.create({
      ...settingsData,
      room: savedRoom,
    });

    await this.roomSettingRepository.save(newRoomSetting);

    // Returns the room with associated parameters
    const resultRoom = await this.roomRepository.findOne({
      where: { id: savedRoom.id },
      relations: ['settings', 'users'],
    });

    return resultRoom ? resultRoom : null; // Returns null if the room is not found for any reason.
  }

  async joinRoom(
    roomId: string,
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
    userId: string,
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
