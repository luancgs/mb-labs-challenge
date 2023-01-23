import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from '../../admins/admins.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminAuthService {
  constructor(
    private adminsService: AdminsService,
    private jwtService: JwtService,
  ) {}

  async validate(email: string, pass: string): Promise<any> {
    const admin = await this.adminsService.getAdminLogin(email);

    if (admin) {
      const passwordMatch = await bcrypt.compare(pass, admin.password);
      if (passwordMatch) {
        const { password, ...result } = admin;
        return result;
      }
    }

    return null;
  }

  async login(admin: any) {
    const payload = { email: admin.email, sub: admin.adminId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
