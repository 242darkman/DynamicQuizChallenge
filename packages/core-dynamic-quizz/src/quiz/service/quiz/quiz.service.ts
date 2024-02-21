import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizEntity } from 'src/quiz/model/quiz/quiz.entity';
import { QuizInterface } from 'src/quiz/model/quiz/quiz.interface';
import { UserEntity } from 'src/user/model/user.entity';
import { UserInterface } from 'src/user/model/user.interface';
import { RankingEntity } from 'src/quiz/model/ranking/ranking';
import { RankingInterface } from 'src/quiz/model/ranking/ranking.interface';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RankingEntity)
    private readonly rankingRepository: Repository<RankingEntity>,
  ) {}

  async createQuiz(quizData: QuizInterface): Promise<QuizEntity> {
    const newQuiz = this.quizRepository.create(quizData);
    return this.quizRepository.save(newQuiz);
  }


  async createRanking(user: UserInterface, score: number): Promise<RankingEntity> {
    try {
        return await this.rankingRepository.save({user, score});
    } catch (error) {
        throw new Error(`Erreur lors de la création du classement : ${error.message}`);
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

  async getUserScores(): Promise<any[]> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.joinedRooms', 'joinedRoom')
      .leftJoin('joinedRoom.room', 'room')
      .leftJoin('room.quiz', 'quiz')
      .addSelect('SUM(quiz.score)', 'totalScore')
      .groupBy('user.id')
      .orderBy('totalScore', 'DESC');

    const userScores = await query.getRawMany();
    return userScores;
  }

  async getScoresByDifficultyAndSubject(
    difficulty: string,
    subjectId: number,
  ): Promise<any[]> {
    const query = this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.subjects', 'subject')
      .leftJoin('quiz.room', 'room')
      .leftJoin('room.joinedUsers', 'joinedRoom')
      .leftJoin('joinedRoom.user', 'user')
      .where('quiz.difficulty = :difficulty', { difficulty })
      .andWhere('subject.id = :subjectId', { subjectId })
      .addSelect('SUM(quiz.score)', 'totalScore')
      .groupBy('user.id')
      .orderBy('totalScore', 'DESC');

    const scores = await query.getRawMany();
    return scores;
  }


  async deleteAll() {
    await this.rankingRepository.createQueryBuilder().delete().execute();
  }
}
