import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { AuthService } from 'src/auth/service/auth.service';
import { UserInterface } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export interface RequestModel extends Request {
  user: UserInterface;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async use(req: RequestModel, res: Response, next: NextFunction) {
    const authHeaders = get(req, 'headers.authorization');
    console.log("🚀 ~ AuthMiddleware ~ use ~ authHeaders:", authHeaders)
    if (isEmpty(authHeaders)) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const tokenParts = (authHeaders as string).split(' ');
    console.log("🚀 ~ AuthMiddleware ~ use ~ tokenParts:", tokenParts)
    if (tokenParts.length !== 2 || isEmpty(tokenParts[1])) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const token = tokenParts[1];
    console.log("🚀 ~ AuthMiddleware ~ use ~ token:", token)
    const decodedToken = await this.decodeToken(token);

    const decodedTokenUserId = get(decodedToken, 'user.id');
    console.log("🚀 ~ AuthMiddleware ~ use ~ decodedTokenUserId:", decodedTokenUserId)
    if (isEmpty(decodedTokenUserId)) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const user: UserInterface =
    await this.userService.getOne(decodedTokenUserId);
    console.log("🚀 ~ AuthMiddleware ~ use ~ user:", user)
    if (isEmpty(user)) {
      throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
    }

    console.log('Done ...')

    req.user = user;
    next();
  }

  private async decodeToken(token: string) {
    try {
      return await this.authService.verifyJwt(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException('Token expired.', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
