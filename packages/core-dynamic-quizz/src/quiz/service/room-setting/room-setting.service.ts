import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoomSettingEntity } from 'src/quiz/model/room/setting/room-setting.entity';
import { RoomSettingInterface } from 'src/quiz/model/room/setting/room-setting.interface';

@Injectable()
export class RoomSettingService {
  constructor(
    @InjectRepository(RoomSettingEntity)
    private readonly roomSettingRepository: Repository<RoomSettingEntity>,
  ) {}

  async create(
    newRoomSetting: RoomSettingInterface,
  ): Promise<RoomSettingInterface> {
    try {
      const roomSetting = this.roomSettingRepository.create(newRoomSetting);
      await this.roomSettingRepository.save(roomSetting);
      return roomSetting;
    } catch (error) {
      throw new HttpException(
        'Failed to create room setting',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePartial(
    roomId: string,
    partialRoomSetting: Partial<RoomSettingInterface>,
  ): Promise<RoomSettingInterface> {
    try {
      await this.roomSettingRepository.update(
        { room: { id: roomId } },
        partialRoomSetting,
      );
      return this.findByRoomId(roomId);
    } catch (error) {
      throw new HttpException(
        'Failed to update room setting',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByRoomId(roomId: string): Promise<RoomSettingInterface> {
    try {
      const roomSetting = await this.roomSettingRepository.findOne({
        where: { room: { id: roomId } },
      });
      if (!roomSetting) {
        throw new HttpException('Room setting not found', HttpStatus.NOT_FOUND);
      }
      return roomSetting;
    } catch (error) {
      throw new HttpException(
        'Failed to find room setting',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
