import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminAuthService } from './admin.auth.service';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(
  Strategy,
  'local.admin',
) {
  constructor(private adminAuthService: AdminAuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const admin = await this.adminAuthService.validate(email, password);
    if (!admin) {
      throw new UnauthorizedException();
    }
    return admin;
  }
}
