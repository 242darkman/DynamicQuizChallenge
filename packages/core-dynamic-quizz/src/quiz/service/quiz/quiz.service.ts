import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInterface } from 'src/user/model/user.interface';
import { RankingEntity } from 'src/quiz/model/ranking/ranking';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(RankingEntity)
    private readonly rankingRepository: Repository<RankingEntity>,
  ) {}

  async createRanking(
    user: UserInterface,
    score: number,
  ): Promise<RankingEntity> {
    try {
      return await this.rankingRepository.save({ user, score });
    } catch (error) {
      throw new Error(
        `Erreur lors de la création du classement : ${error.message}`,
      );
    }
  }

  async findAll(): Promise<RankingEntity[]> {
    return this.rankingRepository
      .createQueryBuilder('ranking')
      .leftJoinAndSelect('ranking.user', 'user')
      .select(['user.username', 'score'])
      .orderBy('score', 'DESC')
      .getRawMany();
  }

  async deleteAll() {
    await this.rankingRepository.createQueryBuilder().delete().execute();
  }
}
