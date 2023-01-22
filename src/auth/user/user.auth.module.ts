import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../../users/users.module';
import { UserAuthService } from './user.auth.service';
import { userJwtConstants } from './user.constants';
import { UserJwtStrategy } from './user.jwt.strategy';
import { UserLocalStrategy } from './user.local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: userJwtConstants.secret,
      signOptions: { expiresIn: '300s' },
    }),
  ],
  providers: [UserAuthService, UserLocalStrategy, UserJwtStrategy],
  exports: [UserAuthService],
})
export class UserAuthModule {}
