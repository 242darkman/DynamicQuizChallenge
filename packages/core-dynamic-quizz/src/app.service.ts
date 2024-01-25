import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): NonNullable<unknown> {
    return { title: 'Hello World!' };
  }
}
