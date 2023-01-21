import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { EventsModule } from './events/events.module';
import { AdminsModule } from './admins/admins.module';
import { TicketsModule } from './tickets/tickets.module';
import { DiscountsModule } from './discounts/discounts.module';
import { CartsModule } from './carts/carts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'admin',
      password: 'admin',
      database: 'MBLABS',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: false,
    }),
    UsersModule,
    EventsModule,
    AdminsModule,
    TicketsModule,
    DiscountsModule,
    CartsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
