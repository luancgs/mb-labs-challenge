import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DiscountsService } from '../discounts/discounts.service';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { EventGetDto } from './DTOs/event.get.dto';
import { Event } from './entities/event.entity';
import { EventMock } from './entities/event.mock';
import { EventCreateError } from './errors/event.create.error';
import { EventDeleteError } from './errors/event.delete.error';
import { EventUpdateError } from './errors/event.update.error';
import { EventsService } from './events.service';
import { DiscountMock } from '../discounts/entities/discount.mock';
import { DiscountGetDto } from '../discounts/DTOs/discount.get.dto';

describe('EventsService', () => {
  let service: EventsService;
  let eventsRepository: Repository<Event>;
  let discountsService: DiscountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useClass: Repository,
        },
        {
          provide: DiscountsService,
          useFactory: () => ({
            getDiscountByEvent: jest.fn(() =>
              Promise.resolve(new DiscountGetDto(new DiscountMock(1))),
            ),
            createDiscount: jest.fn(() => Promise.resolve({})),
          }),
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventsRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    discountsService = module.get<DiscountsService>(DiscountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEvents', () => {
    it('should return all events', async () => {
      jest
        .spyOn(eventsRepository, 'find')
        .mockResolvedValueOnce(eventsDataMock);
      const result = await service.getEvents();
      expect(result.length).toEqual(eventsDataMock.length);
    });

    it('should return EventGetDto objects', async () => {
      jest
        .spyOn(eventsRepository, 'find')
        .mockResolvedValueOnce(eventsDataMock);
      const result = await service.getEvents();
      expect(result[0]).toMatchObject(new EventGetDto(eventsDataMock[0]));
      expect(result[0]).toBeInstanceOf(EventGetDto);
    });

    it('should throw errors', async () => {
      jest.spyOn(eventsRepository, 'find').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.getEvents();
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('getEvent', () => {
    const eventId = 1;

    it('should return EventGetDto object', async () => {
      jest
        .spyOn(eventsRepository, 'findOne')
        .mockResolvedValueOnce(eventsDataMock[0]);
      const result = await service.getEvent(eventId);
      expect(result).toMatchObject(new EventGetDto(eventsDataMock[0]));
      expect(result).toBeInstanceOf(EventGetDto);
    });

    it('should return correct event', async () => {
      jest
        .spyOn(eventsRepository, 'findOne')
        .mockResolvedValueOnce(eventsDataMock[0]);
      const result = await service.getEvent(eventId);
      expect(result.id).toEqual(eventId);
    });

    it('should throw errors', async () => {
      jest.spyOn(eventsRepository, 'findOne').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.getEvent(eventId);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('createEvent', () => {
    const newEvent: Event = new EventMock(3);

    it('should insert event', async () => {
      const insert = jest
        .spyOn(eventsRepository, 'insert')
        .mockResolvedValueOnce(null);
      await service.createEvent(newEvent);
      expect(insert).toBeCalled();
      expect(insert).toBeCalledTimes(1);
      expect(insert).toBeCalledWith(newEvent);
    });

    it('should return void promise', async () => {
      jest.spyOn(eventsRepository, 'insert').mockResolvedValueOnce(null);
      const result = await service.createEvent(newEvent);
      expect(result).toBeUndefined();
    });

    it('should throw EventCreateErrors errors', async () => {
      jest.spyOn(eventsRepository, 'insert').mockImplementation(() => {
        throw new QueryFailedError('query error', ['a'], 'query error');
      });
      try {
        await service.createEvent(newEvent);
      } catch (err) {
        expect(err).toBeInstanceOf(EventCreateError);
        expect(err.message).toContain('query error');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(eventsRepository, 'insert').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.createEvent(newEvent);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('updateEvent', () => {
    const id = 3;
    const partialEvent: Partial<Event> = {
      title: 'mockTitle',
    };

    it('should update event', async () => {
      const update = jest
        .spyOn(eventsRepository, 'update')
        .mockResolvedValueOnce(null);
      await service.updateEvent(id, partialEvent);
      expect(update).toBeCalled();
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(id, partialEvent);
    });

    it('should return void promise', async () => {
      jest.spyOn(eventsRepository, 'update').mockResolvedValueOnce(null);
      const result = await service.updateEvent(id, partialEvent);
      expect(result).toBeUndefined();
    });

    it('should throw EventUpdateErrors errors', async () => {
      jest.spyOn(eventsRepository, 'update').mockImplementation(() => {
        throw new QueryFailedError('query error', ['a'], 'query error');
      });
      try {
        await service.updateEvent(id, partialEvent);
      } catch (err) {
        expect(err).toBeInstanceOf(EventUpdateError);
        expect(err.message).toContain('query error');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(eventsRepository, 'update').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.updateEvent(id, partialEvent);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('deleteEvent', () => {
    const id = 3;

    it('should delete event', async () => {
      const deleteResult = jest
        .spyOn(eventsRepository, 'delete')
        .mockResolvedValueOnce({
          raw: [],
          affected: 1,
        });
      await service.deleteEvent(id);
      expect(deleteResult).toBeCalled();
      expect(deleteResult).toBeCalledTimes(1);
      expect(deleteResult).toBeCalledWith(id);
    });

    it('should return void promise', async () => {
      jest.spyOn(eventsRepository, 'delete').mockResolvedValueOnce({
        raw: [],
        affected: 1,
      });
      const result = await service.deleteEvent(id);
      expect(result).toBeUndefined();
    });

    it('should throw EventDeleteError when invalid id', async () => {
      jest.spyOn(eventsRepository, 'delete').mockResolvedValueOnce({
        raw: [],
        affected: 0,
      });
      try {
        await service.deleteEvent(id);
      } catch (err) {
        expect(err).toBeInstanceOf(EventDeleteError);
        expect(err.message).toContain('event id not found');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(eventsRepository, 'delete').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.deleteEvent(id);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('getEventDiscounts', () => {
    const eventId = 1;

    it('should return DiscountGetDto objects', async () => {
      jest
        .spyOn(discountsService, 'getDiscountByEvent')
        .mockResolvedValueOnce(discountDataMock);
      const result = await service.getEventDiscounts(eventId);
      expect(result[0]).toMatchObject(discountDataMock[0]);
      expect(result[0]).toBeInstanceOf(DiscountGetDto);
    });

    it('should throw errors', async () => {
      jest
        .spyOn(discountsService, 'getDiscountByEvent')
        .mockImplementation(() => {
          throw new Error('generic error');
        });
      try {
        await service.getEventDiscounts(eventId);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('createEventDiscount', () => {
    const eventId = 1;
    const discount = new DiscountMock(3);

    it('should return void promise', async () => {
      jest
        .spyOn(discountsService, 'createDiscount')
        .mockResolvedValueOnce(null);
      const result = await service.createEventDiscount(eventId, discount);
      expect(result).toBeNull();
    });

    it('should create discount', async () => {
      const func = jest
        .spyOn(discountsService, 'createDiscount')
        .mockResolvedValueOnce(null);
      await service.createEventDiscount(eventId, discount);
      expect(func).toBeCalledTimes(1);
    });

    it('should throw errors', async () => {
      jest.spyOn(discountsService, 'createDiscount').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.createEventDiscount(eventId, discount);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('reduceEventTickets', () => {
    const eventId = 1;
    const quantity = 2;

    it('should return void promise', async () => {
      jest.spyOn(eventsRepository, 'decrement').mockResolvedValueOnce(null);
      const result = await service.reduceEventTickets(eventId, quantity);
      expect(result).toBeUndefined();
    });

    it('should reduce tickets count', async () => {
      const func = jest
        .spyOn(eventsRepository, 'decrement')
        .mockResolvedValueOnce(null);
      await service.reduceEventTickets(eventId, quantity);
      expect(func).toBeCalledTimes(1);
    });

    it('should throw EventUpdateError when unable to reduce tickets', async () => {
      jest.spyOn(eventsRepository, 'decrement').mockImplementation(() => {
        throw new QueryFailedError('query error', ['a'], 'query error');
      });
      try {
        await service.reduceEventTickets(eventId, quantity);
      } catch (err) {
        expect(err.message).toContain('query error');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(eventsRepository, 'decrement').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.reduceEventTickets(eventId, quantity);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });
});

const eventsDataMock: Event[] = [new EventMock(1), new EventMock(2)];
const discountDataMock: DiscountGetDto[] = [
  new DiscountGetDto(new DiscountMock(1)),
  new DiscountGetDto(new DiscountMock(2)),
];
