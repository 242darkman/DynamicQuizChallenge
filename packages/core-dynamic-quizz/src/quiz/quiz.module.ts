import { AuthModule } from 'src/auth/auth.module';
import { ConnectedUserEntity } from 'src/quiz/model/connected-user/connected-user.entity';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { JoinedRoomEntity } from 'src/quiz/model/joined-room/joined-room.entity';
import { JoinedRoomService } from './service/joined-room/joined-room.service';
import { Module } from '@nestjs/common';
import { QuizGateway } from 'src/quiz/gateway/quiz.gateway';
import { QuizService } from './service/quiz/quiz.service';
import { RoomEntity } from 'src/quiz/model/room/room.entity';
import { RankingEntity } from './model/ranking/ranking';
import { RoomService } from './service/room/room.service';
import { RoomSettingEntity } from 'src/quiz/model/room/setting/room-setting.entity';
import { RoomSettingService } from 'src/quiz/service/room-setting/room-setting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { OpenAIService } from '../quiz/service/openai/openai.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([
      RoomEntity,
      RoomSettingEntity,
      JoinedRoomEntity,
      ConnectedUserEntity,
      RankingEntity,
    ]),
  ],
  providers: [
    QuizGateway,
    RoomService,
    ConnectedUserService,
    JoinedRoomService,
    QuizService,
    RoomSettingService,
    OpenAIService,
  ],
})
export class QuizModule {}
