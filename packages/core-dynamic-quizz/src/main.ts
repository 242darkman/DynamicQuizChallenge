import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const logger = new Logger('Main (main.ts)');
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      `http://localhost:${process.env.CLIENT_PORT}`,
      `http://127.0.0.1:${process.env.CLIENT_PORT}`,
      new RegExp(
        `/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${process.env.CLIENT_PORT}$/`,
      ),
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Filtrer les propriétés non autorisées
      transform: true, // Transformer automatiquement les payloads
      forbidNonWhitelisted: true, // Refuser les requêtes avec des propriétés non autorisées
    }),
  );
  await app.listen(process.env.API_PORT, '127.0.0.1');
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
