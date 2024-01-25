import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import get from 'lodash/get';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructeur de la classe.
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = get(payload, 'user');
    return { ...user };
  }
}
