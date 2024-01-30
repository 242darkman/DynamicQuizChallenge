import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthMiddleware } from 'src/middleware/auth/auth.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { LoggerMiddleware } from 'src/middleware/logger/logger.middleware';
import OpenAI from 'openai';
import { QuizModule } from './quiz/quiz.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    QuizModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: OpenAI,
      useValue: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  /**
   * Configure les middlewares pour l'application.
   *
   * - `LoggerMiddleware` est appliqué à toutes les routes. Ce middleware est utilisé pour
   *   enregistrer des informations sur les requêtes entrantes, telles que l'URL, la méthode
   *   HTTP, et l'adresse IP du client, ce qui est utile pour le débogage et la surveillance.
   *
   * - `AuthMiddleware` est appliqué à toutes les routes, à l'exception de certaines spécifiées
   *   (par exemple, les routes de création de compte et de connexion). Ce middleware gère
   *   l'authentification des utilisateurs, en s'assurant que seules les requêtes autorisées
   *   peuvent accéder aux routes protégées. Les routes exclues sont celles qui ne nécessitent
   *   pas d'authentification de l'utilisateur, comme la création d'un nouveau compte ou la
   *   connexion.
   *
   * @param {MiddlewareConsumer} consumer - le consommateur de middleware
   * @return {void}
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');

    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'users/create', method: RequestMethod.POST },
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users/check-username', method: RequestMethod.GET },
        { path: 'users/check-email', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
