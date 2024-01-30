import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from 'src/quiz/model/connected-user/connected-user.entity';
import { ConnectedUserInterface } from 'src/quiz/model/connected-user/connected-user.interface';
import { UserInterface } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>,
  ) {}

  async create(
    connectedUser: ConnectedUserInterface,
  ): Promise<ConnectedUserInterface> {
    return this.connectedUserRepository.save(connectedUser);
  }

  async findByUser(user: UserInterface): Promise<ConnectedUserInterface[]> {
    return this.connectedUserRepository.find({ where: { user } });
  }

  async deleteBySocketId(socketId: string) {
    return this.connectedUserRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.connectedUserRepository.createQueryBuilder().delete().execute();
  }
}
