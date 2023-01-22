import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminsModule } from '../../admins/admins.module';
import { AdminAuthService } from './admin.auth.service';
import { adminJwtConstants } from './admin.constants';
import { AdminJwtStrategy } from './admin.jwt.strategy';
import { AdminLocalStrategy } from './admin.local.strategy';

@Module({
  imports: [
    AdminsModule,
    PassportModule,
    JwtModule.register({
      secret: adminJwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  providers: [AdminAuthService, AdminLocalStrategy, AdminJwtStrategy],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
