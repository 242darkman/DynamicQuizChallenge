import { AuthModule } from 'src/auth/auth.module';
import { ConnectedUserEntity } from 'src/quiz/model/connected-user/connected-user.entity';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { JoinedRoomEntity } from 'src/quiz/model/joined-room/joined-room.entity';
import { JoinedRoomService } from './service/joined-room/joined-room.service';
import { Module } from '@nestjs/common';
import { QuestionEntity } from 'src/quiz/model/question/question.entity';
import { QuizEntity } from 'src/quiz/model/quiz/quiz.entity';
import { QuizGateway } from 'src/quiz/gateway/quiz.gateway';
import { QuizService } from './service/quiz/quiz.service';
import { RoomEntity } from 'src/quiz/model/room/room.entity';
import { RoomService } from './service/room/room.service';
import { SubjectEntity } from 'src/quiz/model/subject/subject.entity';
import { SubjectService } from './service/subject/subject.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([
      SubjectEntity,
      QuestionEntity,
      QuizEntity,
      RoomEntity,
      JoinedRoomEntity,
      ConnectedUserEntity,
    ]),
  ],
  providers: [
    QuizGateway,
    SubjectService,
    RoomService,
    ConnectedUserService,
    JoinedRoomService,
    QuizService,
  ],
})
export class QuizModule {}
