import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
  ) {}

  async getEvents(): Promise<Event[]> {
    return await this.eventsRepository.find();
  }

  async getEvent(_id: number): Promise<Event[]> {
    return await this.eventsRepository.find({
      select: [
        'title',
        'address',
        'date',
        'contactEmail',
        'contactPhone',
        'availableTickets',
        'price',
        'createdBy',
        'createdAt',
      ],
      where: [{ id: _id }],
    });
  }

  async createEvent(event: Event) {
    this.eventsRepository.insert(event);
  }

  async updateEvent(id: number, event: Partial<Event>) {
    this.eventsRepository.update(id, event);
  }

  async deleteEvent(id: number) {
    this.eventsRepository.delete(id);
  }
}
