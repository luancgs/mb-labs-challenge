import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CartGetDto } from '../carts/DTOs/cart.get.dto';
import { Cart } from '../carts/entities/cart.entity';
import { CartMock } from '../carts/entities/cart.mock';
import { TicketGetDto } from '../tickets/DTOs/ticket.get.dto';
import { TicketMock } from '../tickets/entities/ticket.mock';
import { User } from './entities/user.entity';
import { UserMock } from './entities/user.mock';
import { UserCreateError } from './errors/user.create.error';
import { UserDeleteError } from './errors/user.delete.error';
import { UserUpdateError } from './errors/user.update.error';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: () => ({
            getUsers: jest.fn(() => Promise.resolve(usersDataMock)),
            getUser: jest.fn(() => Promise.resolve([usersDataMock[0]])),
            getUserCart: jest.fn(() => Promise.resolve(userCartsDataMock)),
            getUserTickets: jest.fn(() => Promise.resolve(userTicketsDataMock)),
            createUser: jest.fn(() => Promise.resolve(null)),
            createUserDiscount: jest.fn(() => Promise.resolve(null)),
            updateUser: jest.fn(() => Promise.resolve(null)),
            updateUserCart: jest.fn(() => Promise.resolve(null)),
            deleteUser: jest.fn(() => Promise.resolve(null)),
            buyCart: jest.fn(() => Promise.resolve('mock response')),
          }),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /users', () => {
    it('should be defined', () => {
      expect(controller.getAll).toBeDefined();
    });

    it('should return UserGetDto objects', async () => {
      const result = await controller.getAll();
      expect(result[0]).toMatchObject(usersDataMock[0]);
    });

    it('should get all userss', async () => {
      const result = await controller.getAll();
      expect(result.length).toBe(usersDataMock.length);
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'getUsers').mockImplementationOnce(() => {
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

  describe('GET /users/:id', () => {
    const userId = 1;
    it('should be defined', () => {
      expect(controller.get).toBeDefined();
    });

    it('should return User object', async () => {
      const result = await controller.get(userId);
      expect(result[0]).toBeInstanceOf(User);
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'getUser').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.get(userId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('GET /users/:id/cart', () => {
    const userId = 1;

    it('should be defined', () => {
      expect(controller.getUserCart).toBeDefined();
    });

    it('should return CartGetDto objects', async () => {
      const result = await controller.getUserCart(userId);
      expect(result[0]).toMatchObject(userCartsDataMock[0]);
      expect(result[0]).toBeInstanceOf(CartGetDto);
    });

    it('should get all carts', async () => {
      const result = await controller.getUserCart(userId);
      expect(result.length).toBe(userCartsDataMock.length);
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'getUserCart').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.getUserCart(userId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('GET /users/:id/tickets', () => {
    const userId = 1;

    it('should be defined', () => {
      expect(controller.getUserTickets).toBeDefined();
    });

    it('should return TicketGetDto objects', async () => {
      const result = await controller.getUserTickets(userId);
      expect(result[0]).toMatchObject(userTicketsDataMock[0]);
      expect(result[0]).toBeInstanceOf(TicketGetDto);
    });

    it('should get all tickets', async () => {
      const result = await controller.getUserTickets(userId);
      expect(result.length).toBe(userTicketsDataMock.length);
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'getUserTickets').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.getUserTickets(userId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('POST /users', () => {
    const newUser: User = new UserMock(3);
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.create(newUser);
      expect(result).toEqual('user created successfully');
    });

    it('should create 1 user', async () => {
      await controller.create(newUser);
      const createUser = jest.spyOn(service, 'createUser');
      expect(createUser).toBeCalledTimes(1);
    });

    it('should throw Bad Request Error when error in body', async () => {
      jest.spyOn(service, 'createUser').mockImplementationOnce(() => {
        throw new UserCreateError('body error');
      });
      try {
        await controller.create(newUser);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(400);
        expect(err.message).toContain('body error');
      }
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'createUser').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.create(newUser);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('POST /users/:id/cart', () => {
    const cart: Partial<Cart> = {
      quantity: 2,
    };

    it('should be defined', () => {
      expect(controller.updateUserCart).toBeDefined();
    });

    it('should update cart', async () => {
      await controller.updateUserCart(cart);
      const createUserCart = jest.spyOn(service, 'updateUserCart');
      expect(createUserCart).toBeCalled();
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'updateUserCart').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.updateUserCart(cart);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('POST /users/:id/buy', () => {
    const userId = 1;
    const paymentMethodHeader = {
      'payment-method': 'card',
    };
    const paymentMethodData = {};

    it('should be defined', () => {
      expect(controller.buyUserCart).toBeDefined();
    });

    it('should buy cart', async () => {
      await controller.buyUserCart(
        userId,
        paymentMethodHeader,
        paymentMethodData,
      );
      const buyCart = jest.spyOn(service, 'buyCart');
      expect(buyCart).toBeCalled();
    });

    it('should throw Bad Request when invalid payment ', async () => {
      try {
        await controller.buyUserCart(
          userId,
          { 'payment-method': 'invalid' },
          paymentMethodData,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('invalid payment method');
      }
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'buyCart').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.buyUserCart(
          userId,
          paymentMethodHeader,
          paymentMethodData,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('PUT /users/:id', () => {
    const id = 3;
    const partialUser: Partial<User> = {
      name: 'mockName',
    };
    it('should be defined', () => {
      expect(controller.update).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.update(id, partialUser);
      expect(result).toEqual('user updated successfully');
    });

    it('should update 1 user', async () => {
      await controller.update(id, partialUser);
      const updateUser = jest.spyOn(service, 'updateUser');
      expect(updateUser).toBeCalledTimes(1);
    });

    it('should throw Bad Request Error when error in body', async () => {
      jest.spyOn(service, 'updateUser').mockImplementationOnce(() => {
        throw new UserUpdateError('body error');
      });
      try {
        await controller.update(id, partialUser);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(400);
        expect(err.message).toContain('body error');
      }
    });

    it('should throw Internal Server Error when generic error ', async () => {
      jest.spyOn(service, 'updateUser').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.update(id, partialUser);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('DELETE /users/:id', () => {
    const userId = 3;
    it('should be defined', () => {
      expect(controller.delete).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.delete(userId);
      expect(result).toEqual('user deleted successfully');
    });

    it('should delete 1 user', async () => {
      await controller.delete(userId);
      const deleteUser = jest.spyOn(service, 'deleteUser');
      expect(deleteUser).toBeCalledTimes(1);
    });

    it('should throw Unprocessable Entity Error when id not found', async () => {
      jest.spyOn(service, 'deleteUser').mockImplementationOnce(() => {
        throw new UserDeleteError('id error');
      });
      try {
        await controller.delete(userId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(422);
        expect(err.message).toContain('id error');
      }
    });

    it('should throw Internal Server Error when generic error ', async () => {
      jest.spyOn(service, 'deleteUser').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.delete(userId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });
});

const usersDataMock: User[] = [new UserMock(1), new UserMock(2)];
const userCartsDataMock: CartGetDto[] = [
  new CartGetDto(new CartMock(1)),
  new CartGetDto(new CartMock(2)),
];
const userTicketsDataMock: TicketGetDto[] = [
  new TicketGetDto(new TicketMock(1)),
  new TicketGetDto(new TicketMock(2)),
];
