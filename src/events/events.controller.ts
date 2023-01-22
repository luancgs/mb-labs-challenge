import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from '../auth/admin/admin.jwt.auth.guard';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { EventCreateError } from './errors/event.create.error';
import { EventDeleteError } from './errors/event.delete.error';
import { EventUpdateError } from './errors/event.update.error';
import { Event } from './event.entity';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private service: EventsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Query('title') title?: string,
    @Query('organizer') organizer?: string,
    @Query('address') address?: string,
    @Query('availableOnly') availableOnly?: string,
  ) {
    try {
      return await this.service.getEvents(
        title,
        organizer,
        address,
        availableOnly,
      );
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: number) {
    try {
      return await this.service.getEventById(id);
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  async create(@Body() event: Event) {
    try {
      await this.service.createEvent(event);
      return 'event created successfully';
    } catch (error) {
      if (error instanceof EventCreateError) {
        throw new HttpException(
          `Bad Request: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          `Error: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Put(':id')
  @UseGuards(AdminJwtAuthGuard)
  async update(@Param('id') id: number, @Body() event: Partial<Event>) {
    try {
      await this.service.updateEvent(id, event);
      return 'event updated successfully';
    } catch (error) {
      if (error instanceof EventUpdateError) {
        throw new HttpException(
          `Bad Request: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          `Error: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  async delete(@Param('id') id: number) {
    try {
      await this.service.deleteEvent(id);
      return 'event deleted successfully';
    } catch (error) {
      if (error instanceof EventDeleteError) {
        throw new HttpException(
          `Failed Request: ${error.message}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      } else {
        throw new HttpException(
          `Error: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
