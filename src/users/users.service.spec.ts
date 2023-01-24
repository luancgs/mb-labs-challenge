import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartsService } from '../carts/carts.service';
import { CartGetDto } from '../carts/DTOs/cart.get.dto';
import { Cart } from '../carts/entities/cart.entity';
import { CartMock } from '../carts/entities/cart.mock';
import { EventsService } from '../events/events.service';
import { PaymentService } from '../payment/payment.service';
import { TicketGetDto } from '../tickets/DTOs/ticket.get.dto';
import { TicketMock } from '../tickets/entities/ticket.mock';
import { TicketsService } from '../tickets/tickets.service';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserMock } from './entities/user.mock';
import { UserCreateError } from './errors/user.create.error';
import { UserDeleteError } from './errors/user.delete.error';
import { UserUpdateError } from './errors/user.update.error';
import { UsersService } from './users.service';
import { TicketCreateError } from '../tickets/errors/ticket.create.error';
import { CartDeleteError } from '../carts/errors/cart.delete.error';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;
  let cartsService: CartsService;
  let paymentService: PaymentService;
  let eventsService: EventsService;
  let ticketsService: TicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: CartsService,
          useFactory: () => ({
            getCartByUserId: jest.fn(() => Promise.resolve(cartsDataMock)),
            updateCartById: jest.fn(() => Promise.resolve(undefined)),
            deleteCartByUserId: jest.fn(() => Promise.resolve(undefined)),
          }),
        },
        {
          provide: PaymentService,
          useFactory: () => ({
            calculateCartValue: jest.fn(() => Promise.resolve(179)),
            executePayment: jest.fn(() => Promise.resolve(undefined)),
          }),
        },
        {
          provide: TicketsService,
          useFactory: () => ({
            getTicketByUser: jest.fn(() => Promise.resolve(ticketsDataMock)),
            createTicketByCartItem: jest.fn(() => Promise.resolve(undefined)),
          }),
        },
        {
          provide: EventsService,
          useFactory: () => ({
            reduceEventTickets: jest.fn(() => Promise.resolve(undefined)),
          }),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    cartsService = module.get<CartsService>(CartsService);
    paymentService = module.get<PaymentService>(PaymentService);
    ticketsService = module.get<TicketsService>(TicketsService);
    eventsService = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      jest.spyOn(usersRepository, 'find').mockResolvedValueOnce(usersDataMock);
      const result = await service.getUsers();
      expect(result.length).toEqual(usersDataMock.length);
    });

    it('should return user objects', async () => {
      jest.spyOn(usersRepository, 'find').mockResolvedValueOnce(usersDataMock);
      const result = await service.getUsers();
      expect(result[0]).toMatchObject(usersDataMock[0]);
      expect(result[0]).toBeInstanceOf(User);
    });

    it('should throw errors', async () => {
      jest.spyOn(usersRepository, 'find').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.getUsers();
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('getUser', () => {
    const userId = 1;

    it('should return user object', async () => {
      jest
        .spyOn(usersRepository, 'find')
        .mockResolvedValueOnce([usersDataMock[0]]);
      const result = await service.getUser(userId);
      expect(result[0]).toMatchObject(usersDataMock[0]);
      expect(result[0]).toBeInstanceOf(User);
    });

    it('should return correct user', async () => {
      jest
        .spyOn(usersRepository, 'find')
        .mockResolvedValueOnce([usersDataMock[0]]);
      const result = await service.getUser(userId);
      expect(result[0].id).toEqual(usersDataMock[0].id);
    });

    it('should throw errors', async () => {
      jest.spyOn(usersRepository, 'find').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.getUser(userId);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('getUserLogin', () => {
    it('should be defined', () => {
      expect(service.getUserLogin).toBeDefined();
    });
  });

  describe('createUser', () => {
    const newUser: User = new UserMock(3);

    it('should insert user', async () => {
      const insert = jest
        .spyOn(usersRepository, 'insert')
        .mockResolvedValueOnce(null);
      await service.createUser(newUser);
      expect(insert).toBeCalled();
      expect(insert).toBeCalledTimes(1);
      expect(insert).toBeCalledWith(newUser);
    });

    it('should return void promise', async () => {
      jest.spyOn(usersRepository, 'insert').mockResolvedValueOnce(null);
      const result = await service.createUser(newUser);
      expect(result).toBeUndefined();
    });

    it('should throw UserCreateErrors errors', async () => {
      jest.spyOn(usersRepository, 'insert').mockImplementation(() => {
        throw new QueryFailedError('query error', ['a'], 'query error');
      });
      try {
        await service.createUser(newUser);
      } catch (err) {
        expect(err).toBeInstanceOf(UserCreateError);
        expect(err.message).toContain('query error');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(usersRepository, 'insert').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.createUser(newUser);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('updateUser', () => {
    const id = 3;
    const partialUser: Partial<User> = {
      name: 'mockName',
    };

    it('should update user', async () => {
      const update = jest
        .spyOn(usersRepository, 'update')
        .mockResolvedValueOnce(null);
      await service.updateUser(id, partialUser);
      expect(update).toBeCalled();
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(id, partialUser);
    });

    it('should return void promise', async () => {
      jest.spyOn(usersRepository, 'update').mockResolvedValueOnce(null);
      const result = await service.updateUser(id, partialUser);
      expect(result).toBeUndefined();
    });

    it('should throw UserUpdateErrors errors', async () => {
      jest.spyOn(usersRepository, 'update').mockImplementation(() => {
        throw new QueryFailedError('query error', ['a'], 'query error');
      });
      try {
        await service.updateUser(id, partialUser);
      } catch (err) {
        expect(err).toBeInstanceOf(UserUpdateError);
        expect(err.message).toContain('query error');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(usersRepository, 'update').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.updateUser(id, partialUser);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('deleteUser', () => {
    const id = 3;

    it('should delete user', async () => {
      const deleteResult = jest
        .spyOn(usersRepository, 'delete')
        .mockResolvedValueOnce({
          raw: [],
          affected: 1,
        });
      await service.deleteUser(id);
      expect(deleteResult).toBeCalled();
      expect(deleteResult).toBeCalledTimes(1);
      expect(deleteResult).toBeCalledWith(id);
    });

    it('should return void promise', async () => {
      jest.spyOn(usersRepository, 'delete').mockResolvedValueOnce({
        raw: [],
        affected: 1,
      });
      const result = await service.deleteUser(id);
      expect(result).toBeUndefined();
    });

    it('should throw UserDeleteError when invalid id', async () => {
      jest.spyOn(usersRepository, 'delete').mockResolvedValueOnce({
        raw: [],
        affected: 0,
      });
      try {
        await service.deleteUser(id);
      } catch (err) {
        expect(err).toBeInstanceOf(UserDeleteError);
        expect(err.message).toContain('user id not found');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(usersRepository, 'delete').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.deleteUser(id);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('getUserTickets', () => {
    const userId = 1;

    it('should return TicketGetDto objects', async () => {
      const result = await service.getUserTickets(userId);
      expect(result[0]).toMatchObject(ticketsDataMock[0]);
      expect(result[0]).toBeInstanceOf(TicketGetDto);
    });

    it('should throw errors', async () => {
      jest.spyOn(ticketsService, 'getTicketByUser').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.getUserTickets(userId);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('getUserCart', () => {
    const userId = 1;

    it('should return CartGetDto objects', async () => {
      const result = await service.getUserCart(userId);
      expect(result[0]).toMatchObject(cartsDataMock[0]);
      expect(result[0]).toBeInstanceOf(CartGetDto);
    });

    it('should throw errors', async () => {
      jest.spyOn(cartsService, 'getCartByUserId').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.getUserCart(userId);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('updateUserCart', () => {
    const cart: Partial<Cart> = {
      id: 1,
      quantity: 2,
    };

    it('should return void promise', async () => {
      const result = await service.updateUserCart(cart);
      expect(result).toBeUndefined();
    });

    it('should throw errors', async () => {
      jest.spyOn(cartsService, 'updateCartById').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.updateUserCart(cart);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('buyCart', () => {
    const userId = 1;
    const paymentMethod = 'card';
    const paymentMethodData = {};

    it('should return payment succcessful', async () => {
      const result = await service.buyCart(
        userId,
        paymentMethod,
        paymentMethodData,
      );
      expect(result).toBe('payment successful');
    });

    it('should throw UserCartError if tries to buy empty cart', async () => {
      jest.spyOn(cartsService, 'getCartByUserId').mockResolvedValueOnce([]);
      try {
        await service.buyCart(userId, paymentMethod, paymentMethodData);
      } catch (err) {
        expect(err.message).toContain('cannot buy an empty cart');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(cartsService, 'getCartByUserId').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.buyCart(userId, paymentMethod, paymentMethodData);
      } catch (err) {
        expect(err.message).toContain('generic');
      }
    });
  });

  describe('afterBuy', () => {
    const userId = 1;
    const cart = [new CartGetDto(new CartMock(3))];

    it('should reduce event ticket count', async () => {
      const reduce = jest.spyOn(eventsService, 'reduceEventTickets');
      await service.afterBuy(userId, cart);

      expect(reduce).toBeCalledTimes(1);
    });

    it('should clear cart', async () => {
      const clear = jest.spyOn(cartsService, 'deleteCartByUserId');
      await service.afterBuy(userId, cart);

      expect(clear).toBeCalledTimes(1);
    });

    it('should throw TicketCreateError if cannot create tickets', async () => {
      jest
        .spyOn(ticketsService, 'createTicketByCartItem')
        .mockImplementationOnce(() => {
          throw new Error('');
        });
      try {
        await service.afterBuy(userId, cart);
      } catch (err) {
        expect(err).toBeInstanceOf(TicketCreateError);
      }
    });

    it('should throw CartDeleteError if cannot clear cart', async () => {
      jest
        .spyOn(cartsService, 'deleteCartByUserId')
        .mockImplementationOnce(() => {
          throw new Error('');
        });
      try {
        await service.afterBuy(userId, cart);
      } catch (err) {
        expect(err).toBeInstanceOf(CartDeleteError);
      }
    });
  });
});

const usersDataMock = [new UserMock(1), new UserMock(2)];
const ticketsDataMock = [
  new TicketGetDto(new TicketMock(1)),
  new TicketGetDto(new TicketMock(2)),
];
const cartsDataMock = [
  new CartGetDto(new CartMock(1)),
  new CartGetDto(new CartMock(2)),
];
