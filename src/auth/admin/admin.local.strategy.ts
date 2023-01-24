import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
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
      throw new HttpException(
        `Unauthorized: incorrect email or password`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return admin;
  }
}
