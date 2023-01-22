import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserAuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validate(email: string, pass: string): Promise<any> {
    //const hash = await bcrypt.hash(pass, 10);
    const user = await this.usersService.getUserByEmail(email);

    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, type: 'user', sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
