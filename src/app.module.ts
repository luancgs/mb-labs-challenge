import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { AdminsModule } from './admins/admins.module';
import { TicketsModule } from './tickets/tickets.module';
import { DiscountsModule } from './discounts/discounts.module';
import { CartsModule } from './carts/carts.module';
import { OrganizersModule } from './organizers/organizers.module';
import { UserAuthModule } from './auth/user/user.auth.module';
import { AdminAuthModule } from './auth/admin/admin.auth.module';

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
    OrganizersModule,
    AdminAuthModule,
    UserAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
