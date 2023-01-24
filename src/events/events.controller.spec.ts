import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscountCreateError } from '../discounts/errors/discount.create.error';
import { DiscountGetDto } from '../discounts/DTOs/discount.get.dto';
import { DiscountMock } from '../discounts/entities/discount.mock';
import { EventGetDto } from './DTOs/event.get.dto';
import { Event } from './entities/event.entity';
import { EventMock } from './entities/event.mock';
import { EventCreateError } from './errors/event.create.error';
import { EventDeleteError } from './errors/event.delete.error';
import { EventUpdateError } from './errors/event.update.error';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useFactory: () => ({
            getEvents: jest.fn(() => Promise.resolve(eventsDataMock)),
            getEvent: jest.fn(() => Promise.resolve(eventsDataMock[0])),
            getEventDiscounts: jest.fn(() =>
              Promise.resolve(eventDiscountsDataMock),
            ),
            createEvent: jest.fn(() => Promise.resolve(null)),
            createEventDiscount: jest.fn(() => Promise.resolve(null)),
            updateEvent: jest.fn(() => Promise.resolve(null)),
            deleteEvent: jest.fn(() => Promise.resolve(null)),
          }),
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('GET /events', () => {
    it('should be defined', () => {
      expect(controller.getAll).toBeDefined();
    });

    it('should return EventGetDto objects', async () => {
      const result = await controller.getAll();
      expect(result[0]).toMatchObject(eventsDataMock[0]);
      expect(result[0]).toBeInstanceOf(EventGetDto);
    });

    it('should get all eventss', async () => {
      const result = await controller.getAll();
      expect(result.length).toBe(eventsDataMock.length);
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'getEvents').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.getAll();
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('GET /events/:id', () => {
    const eventId = 1;
    it('should be defined', () => {
      expect(controller.get).toBeDefined();
    });

    it('should return EventGetDto object', async () => {
      const result = await controller.get(eventId);
      expect(result).toBeInstanceOf(EventGetDto);
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'getEvent').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.get(eventId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('GET /events/:id/discounts', () => {
    const eventId = 1;

    it('should be defined', () => {
      expect(controller.getEventDiscounts).toBeDefined();
    });

    it('should return DiscountGetDto objects', async () => {
      const result = await controller.getEventDiscounts(eventId);
      expect(result[0]).toMatchObject(eventDiscountsDataMock[0]);
      expect(result[0]).toBeInstanceOf(DiscountGetDto);
    });

    it('should get all discounts', async () => {
      const result = await controller.getEventDiscounts(eventId);
      expect(result.length).toBe(eventDiscountsDataMock.length);
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'getEventDiscounts').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.getEventDiscounts(eventId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('POST /events/:id/discounts', () => {
    const eventId = 1;
    const discount = new DiscountMock(1);

    it('should be defined', () => {
      expect(controller.createEventDiscount).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.createEventDiscount(eventId, discount);
      expect(result).toEqual('discount created successfully');
    });

    it('should create 1 discount', async () => {
      await controller.createEventDiscount(eventId, discount);
      const createEventDiscount = jest.spyOn(service, 'createEventDiscount');
      expect(createEventDiscount).toBeCalledTimes(1);
    });

    it('should throw Bad Request Error when error in body', async () => {
      jest.spyOn(service, 'createEventDiscount').mockImplementationOnce(() => {
        throw new DiscountCreateError('body error');
      });
      try {
        await controller.createEventDiscount(eventId, discount);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(400);
        expect(err.message).toContain('body error');
      }
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'createEventDiscount').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.createEventDiscount(eventId, discount);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('POST /events', () => {
    const newEvent: Event = new EventMock(3);
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.create(newEvent);
      expect(result).toEqual('event created successfully');
    });

    it('should create 1 event', async () => {
      await controller.create(newEvent);
      const createEvent = jest.spyOn(service, 'createEvent');
      expect(createEvent).toBeCalledTimes(1);
    });

    it('should throw Bad Request Error when error in body', async () => {
      jest.spyOn(service, 'createEvent').mockImplementationOnce(() => {
        throw new EventCreateError('body error');
      });
      try {
        await controller.create(newEvent);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(400);
        expect(err.message).toContain('body error');
      }
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'createEvent').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.create(newEvent);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('PUT /events/:id', () => {
    const id = 3;
    const partialEvent: Partial<Event> = {
      title: 'mockTitle',
    };
    it('should be defined', () => {
      expect(controller.update).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.update(id, partialEvent);
      expect(result).toEqual('event updated successfully');
    });

    it('should update 1 event', async () => {
      await controller.update(id, partialEvent);
      const updateEvent = jest.spyOn(service, 'updateEvent');
      expect(updateEvent).toBeCalledTimes(1);
    });

    it('should throw Bad Request Error when error in body', async () => {
      jest.spyOn(service, 'updateEvent').mockImplementationOnce(() => {
        throw new EventUpdateError('body error');
      });
      try {
        await controller.update(id, partialEvent);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(400);
        expect(err.message).toContain('body error');
      }
    });

    it('should throw Internal Server Error when generic error ', async () => {
      jest.spyOn(service, 'updateEvent').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.update(id, partialEvent);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('DELETE /events/:id', () => {
    const eventId = 3;
    it('should be defined', () => {
      expect(controller.delete).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.delete(eventId);
      expect(result).toEqual('event deleted successfully');
    });

    it('should delete 1 event', async () => {
      await controller.delete(eventId);
      const deleteEvent = jest.spyOn(service, 'deleteEvent');
      expect(deleteEvent).toBeCalledTimes(1);
    });

    it('should throw Unprocessable Entity Error when id not found', async () => {
      jest.spyOn(service, 'deleteEvent').mockImplementationOnce(() => {
        throw new EventDeleteError('id error');
      });
      try {
        await controller.delete(eventId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(422);
        expect(err.message).toContain('id error');
      }
    });

    it('should throw Internal Server Error when generic error ', async () => {
      jest.spyOn(service, 'deleteEvent').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.delete(eventId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });
});

const eventsDataMock: EventGetDto[] = [
  new EventMock(1).controller(),
  new EventMock(2).controller(),
];

const eventDiscountsDataMock: DiscountGetDto[] = [
  new DiscountMock(1).controller(),
  new DiscountMock(2).controller(),
];
