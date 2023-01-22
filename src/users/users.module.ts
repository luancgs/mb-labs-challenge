import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { CartsModule } from 'src/carts/carts.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CartsModule, PaymentModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
