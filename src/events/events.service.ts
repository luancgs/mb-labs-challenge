import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  EntityPropertyNotFoundError,
  FindManyOptions,
  FindOptionsWhere,
  Like,
  MoreThan,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { EventCreateError } from './errors/event.create.error';
import { EventUpdateError } from './errors/event.update.error';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
  ) {}

  async getEvents(
    title: string,
    organizer: string,
    address: string,
    availableOnly: string,
  ): Promise<Event[]> {
    try {
      const queryOptions = this.buildFilterQuery(
        title,
        organizer,
        address,
        availableOnly,
      );
      return await this.eventsRepository.find(queryOptions);
    } catch (error) {
      throw error;
    }
  }

  async getEventById(_id: number): Promise<Event[]> {
    try {
      return await this.eventsRepository.find({
        where: [{ id: _id }],
        loadRelationIds: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async createEvent(event: Event) {
    try {
      await this.eventsRepository.insert(event);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new EventCreateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async updateEvent(id: number, event: Partial<Event>) {
    try {
      await this.eventsRepository.update(id, event);
    } catch (error) {
      if (
        error instanceof QueryFailedError ||
        error instanceof EntityPropertyNotFoundError
      ) {
        throw new EventUpdateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async deleteEvent(id: number) {
    try {
      await this.eventsRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  buildFilterQuery(
    _title: string,
    _organizer: string,
    _address: string,
    availableOnly: string,
  ): FindManyOptions {
    let queryOptions: FindManyOptions = {
      loadRelationIds: true,
    };

    let filter: FindOptionsWhere<Event> = {};

    if (_title !== undefined) {
      filter = Object.assign({ title: Like(`%${_title}%`) }, filter);
    }
    if (_organizer !== undefined) {
      filter = Object.assign({ organizer: { id: _organizer } }, filter);
    }
    if (_address !== undefined) {
      filter = Object.assign({ address: Like(`%${_address}%`) }, filter);
    }
    if (availableOnly !== undefined) {
      filter = Object.assign({
        date: MoreThan(new Date()),
        availableTickets: MoreThan(0),
      });
    }

    if (Object.keys(filter).length !== 0) {
      queryOptions = Object.assign({ where: [filter] }, queryOptions);
    }

    return queryOptions;
  }
}
