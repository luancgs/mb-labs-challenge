import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from 'src/discounts/discount.entity';
import { DiscountsService } from 'src/discounts/discounts.service';

import {
  EntityPropertyNotFoundError,
  FindManyOptions,
  FindOptionsWhere,
  Like,
  MoreThan,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { EventGetDto } from './DTOs/event.get.dto';
import { EventCreateError } from './errors/event.create.error';
import { EventDeleteError } from './errors/event.delete.error';
import { EventUpdateError } from './errors/event.update.error';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
    private discountsService: DiscountsService,
  ) {}

  async getEvents(
    title: string,
    organizer: string,
    address: string,
    availableOnly: string,
  ): Promise<EventGetDto[]> {
    try {
      const queryOptions = this.buildFilterQuery(
        title,
        organizer,
        address,
        availableOnly,
      );

      const events = await this.eventsRepository.find(queryOptions);

      const output: EventGetDto[] = [];
      for (const event of events) {
        output.push(new EventGetDto(event));
      }

      return output;
    } catch (error) {
      throw error;
    }
  }

  async getEvent(_id: number): Promise<EventGetDto> {
    try {
      const event = await this.eventsRepository.findOne({
        where: { id: _id },
      });
      if (event) {
        return new EventGetDto(event);
      } else {
        return null;
      }
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
      const deleteResult = await this.eventsRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new EventDeleteError('event id not found');
      }
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
    let queryOptions: FindManyOptions = {};

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

  async getEventDiscounts(id: number) {
    try {
      return await this.discountsService.getDiscountByEvent(id);
    } catch (error) {
      throw error;
    }
  }

  async createEventDiscount(id: number, discount: Discount) {
    try {
      return await this.discountsService.createDiscount(discount);
    } catch (error) {
      throw error;
    }
  }

  async reduceEventTickets(_id: number, quantity: number) {
    try {
      await this.eventsRepository.decrement(
        { id: _id },
        'availableTickets',
        quantity,
      );
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
}
