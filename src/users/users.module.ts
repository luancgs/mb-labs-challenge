import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { CartsModule } from 'src/carts/carts.module';
import { PaymentModule } from 'src/payment/payment.module';
import { TicketsModule } from 'src/tickets/tickets.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CartsModule,
    PaymentModule,
    TicketsModule,
    EventsModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
