import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserMock } from '../users/entities/user.mock';
import { QueryFailedError, Repository } from 'typeorm';
import { TicketGetDto } from './DTOs/ticket.get.dto';
import { Ticket } from './entities/ticket.entity';
import { TicketMock } from './entities/ticket.mock';
import { TicketCreateError } from './errors/ticket.create.error';
import { TicketDeleteError } from './errors/ticket.delete.error';
import { TicketUpdateError } from './errors/ticket.update.error';
import { TicketsService } from './tickets.service';

describe('TicketsService', () => {
  let service: TicketsService;
  let ticketsRepository: Repository<Ticket>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(Ticket),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    ticketsRepository = module.get<Repository<Ticket>>(
      getRepositoryToken(Ticket),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTickets', () => {
    it('should return all tickets', async () => {
      jest
        .spyOn(ticketsRepository, 'find')
        .mockResolvedValueOnce(ticketsDataMock);
      const result = await service.getTickets();
      expect(result.length).toEqual(ticketsDataMock.length);
    });

    it('should throw errors', async () => {
      jest.spyOn(ticketsRepository, 'find').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.getTickets();
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('getTicketById', () => {
    const ticketId = 1;

    it('should return ticket object', async () => {
      jest
        .spyOn(ticketsRepository, 'find')
        .mockResolvedValueOnce([ticketsDataMock[0]]);
      const result = await service.getTicketById(ticketId);
      expect(result[0]).toMatchObject(ticketsDataMock[0]);
      expect(result[0]).toBeInstanceOf(Ticket);
    });

    it('should return correct ticket', async () => {
      jest
        .spyOn(ticketsRepository, 'find')
        .mockResolvedValueOnce([ticketsDataMock[0]]);
      const result = await service.getTicketById(ticketId);
      expect(result[0].id).toEqual(ticketId);
    });

    it('should throw errors', async () => {
      jest.spyOn(ticketsRepository, 'find').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.getTicketById(ticketId);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('getTicketByUser', () => {
    const userId = 1;

    it('should return TicketGetDto object', async () => {
      jest
        .spyOn(ticketsRepository, 'find')
        .mockResolvedValueOnce(ticketsDataMock);
      const result = await service.getTicketByUser(userId);
      expect(result[0]).toMatchObject(new TicketGetDto(ticketsDataMock[0]));
      expect(result[0]).toBeInstanceOf(TicketGetDto);
    });

    it('should return all tickets', async () => {
      jest
        .spyOn(ticketsRepository, 'find')
        .mockResolvedValueOnce(ticketsDataMock);
      const result = await service.getTicketByUser(userId);
      expect(result.length).toEqual(ticketsDataMock.length);
    });

    it('should throw errors', async () => {
      jest.spyOn(ticketsRepository, 'find').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.getTicketByUser(userId);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('createTicket', () => {
    const newTicket: Ticket = new TicketMock(3);

    it('should insert ticket', async () => {
      const insert = jest
        .spyOn(ticketsRepository, 'insert')
        .mockResolvedValueOnce(null);
      await service.createTicket(newTicket);
      expect(insert).toBeCalled();
      expect(insert).toBeCalledTimes(1);
      expect(insert).toBeCalledWith(newTicket);
    });

    it('should return void promise', async () => {
      jest.spyOn(ticketsRepository, 'insert').mockResolvedValueOnce(null);
      const result = await service.createTicket(newTicket);
      expect(result).toBeUndefined();
    });

    it('should throw TicketCreateErrors errors', async () => {
      jest.spyOn(ticketsRepository, 'insert').mockImplementation(() => {
        throw new QueryFailedError('query error', ['a'], 'query error');
      });
      try {
        await service.createTicket(newTicket);
      } catch (err) {
        expect(err).toBeInstanceOf(TicketCreateError);
        expect(err.message).toContain('query error');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(ticketsRepository, 'insert').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.createTicket(newTicket);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('updateTicket', () => {
    const id = 3;
    const partialTicket: Partial<Ticket> = {
      user: new UserMock(1),
    };

    it('should update ticket', async () => {
      const update = jest
        .spyOn(ticketsRepository, 'update')
        .mockResolvedValueOnce(null);
      await service.updateTicket(id, partialTicket);
      expect(update).toBeCalled();
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(id, partialTicket);
    });

    it('should return void promise', async () => {
      jest.spyOn(ticketsRepository, 'update').mockResolvedValueOnce(null);
      const result = await service.updateTicket(id, partialTicket);
      expect(result).toBeUndefined();
    });

    it('should throw TicketUpdateErrors errors', async () => {
      jest.spyOn(ticketsRepository, 'update').mockImplementation(() => {
        throw new QueryFailedError('query error', ['a'], 'query error');
      });
      try {
        await service.updateTicket(id, partialTicket);
      } catch (err) {
        expect(err).toBeInstanceOf(TicketUpdateError);
        expect(err.message).toContain('query error');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(ticketsRepository, 'update').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.updateTicket(id, partialTicket);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('deleteTicket', () => {
    const id = 3;

    it('should delete ticket', async () => {
      const deleteResult = jest
        .spyOn(ticketsRepository, 'delete')
        .mockResolvedValueOnce({
          raw: [],
          affected: 1,
        });
      await service.deleteTicket(id);
      expect(deleteResult).toBeCalled();
      expect(deleteResult).toBeCalledTimes(1);
      expect(deleteResult).toBeCalledWith(id);
    });

    it('should return void promise', async () => {
      jest.spyOn(ticketsRepository, 'delete').mockResolvedValueOnce({
        raw: [],
        affected: 1,
      });
      const result = await service.deleteTicket(id);
      expect(result).toBeUndefined();
    });

    it('should throw TicketDeleteError when invalid id', async () => {
      jest.spyOn(ticketsRepository, 'delete').mockResolvedValueOnce({
        raw: [],
        affected: 0,
      });
      try {
        await service.deleteTicket(id);
      } catch (err) {
        expect(err).toBeInstanceOf(TicketDeleteError);
        expect(err.message).toContain('ticket id not found');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(ticketsRepository, 'delete').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.deleteTicket(id);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });
});

const ticketsDataMock: TicketMock[] = [new TicketMock(1), new TicketMock(2)];
