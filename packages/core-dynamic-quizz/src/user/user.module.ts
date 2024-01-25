import { AuthModule } from 'src/auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/user/controller/user.controller';
import { UserEntity } from 'src/user/model/user.entity';
import { UserHelperService } from 'src/user/service/user-helper/user-helper.service';
import { UserService } from 'src/user/service/user-service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  controllers: [UserController],
  providers: [UserService, UserHelperService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
