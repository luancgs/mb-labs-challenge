import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserAuthService } from './user.auth.service';

@Injectable()
export class UserLocalStrategy extends PassportStrategy(
  Strategy,
  'local.user',
) {
  constructor(private userAuthService: UserAuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userAuthService.validate(email, password);
    if (!user) {
      throw new HttpException(
        `Unauthorized: incorrect email or password`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
