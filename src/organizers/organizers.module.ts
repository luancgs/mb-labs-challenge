import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizersService } from './organizers.service';
import { OrganizersController } from './organizers.controller';
import { Organizer } from './organizer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organizer])],
  providers: [OrganizersService],
  controllers: [OrganizersController],
})
export class OrganizersModule {}
