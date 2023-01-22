import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { adminJwtConstants } from './admin.constants';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'jwt.admin') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: adminJwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { adminId: payload.sub, email: payload.email };
  }
}
