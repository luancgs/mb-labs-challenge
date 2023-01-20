import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { Event } from './event.entity';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private service: EventsService) {}

  @Get()
  getAll() {
    return this.service.getEvents();
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.service.getEvent(id);
  }

  @Post()
  create(@Body() event: Event) {
    return this.service.createEvent(event);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() event: Partial<Event>) {
    return this.service.updateEvent(id, event);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.deleteEvent(id);
  }
}
