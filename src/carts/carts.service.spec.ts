import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartsService } from './carts.service';
import { CartGetDto } from './DTOs/cart.get.dto';
import { CartMock } from './entities/cart.mock';
import { CartUpdateError } from './errors/cart.update.error';
import { CartDeleteError } from './errors/cart.delete.error';

describe('CartsService', () => {
  let service: CartsService;
  let cartsRepository: Repository<Cart>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        {
          provide: getRepositoryToken(Cart),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CartsService>(CartsService);
    cartsRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCartByUserId', () => {
    const userId = 1;
    it('should return all cart items', async () => {
      jest.spyOn(cartsRepository, 'find').mockResolvedValueOnce(cartsDataMock);
      const result = await service.getCartByUserId(userId);
      expect(result.length).toEqual(cartsDataMock.length);
    });

    it('should return CartGetDto object', async () => {
      jest.spyOn(cartsRepository, 'find').mockResolvedValueOnce(cartsDataMock);
      const result = await service.getCartByUserId(userId);
      expect(result[0]).toBeInstanceOf(CartGetDto);
    });

    it('should throw errors', async () => {
      jest.spyOn(cartsRepository, 'find').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.getCartByUserId(userId);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('updateCartById', () => {
    const cartId = 1;
    const partialCart: Partial<Cart> = {
      quantity: 4,
    };
    it('should update cart with specific id', async () => {
      const update = jest
        .spyOn(cartsRepository, 'save')
        .mockResolvedValueOnce(null);
      await service.updateCartById(cartId, partialCart);
      expect(update).toBeCalled();
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(partialCart);
    });

    it('should return void promise', async () => {
      jest.spyOn(cartsRepository, 'save').mockResolvedValueOnce(null);
      const result = await service.updateCartById(cartId, partialCart);
      expect(result).toBeUndefined();
    });

    it('should throw CartUpdateError errors', async () => {
      jest.spyOn(cartsRepository, 'save').mockImplementation(() => {
        throw new QueryFailedError('query error', ['a'], 'query error');
      });
      try {
        await service.updateCartById(cartId, partialCart);
      } catch (err) {
        expect(err).toBeInstanceOf(CartUpdateError);
        expect(err.message).toContain('query error');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(cartsRepository, 'save').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.updateCartById(cartId, partialCart);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('deleteCartByUserId', () => {
    const userId = 1;

    it('should delete cart', async () => {
      const deleteResult = jest
        .spyOn(cartsRepository, 'delete')
        .mockResolvedValueOnce({
          raw: [],
          affected: 1,
        });
      await service.deleteCartByUserId(userId);
      expect(deleteResult).toBeCalled();
      expect(deleteResult).toBeCalledTimes(1);
      expect(deleteResult).toBeCalledWith({ user: { id: userId } });
    });

    it('should return void promise', async () => {
      jest.spyOn(cartsRepository, 'delete').mockResolvedValueOnce({
        raw: [],
        affected: 1,
      });
      const result = await service.deleteCartByUserId(userId);
      expect(result).toBeUndefined();
    });

    it('should throw CartDeleteError errors', async () => {
      jest.spyOn(cartsRepository, 'delete').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.deleteCartByUserId(userId);
      } catch (err) {
        expect(err).toBeInstanceOf(CartDeleteError);
        expect(err.message).toContain('generic error');
      }
    });
  });
});

const cartsDataMock: Cart[] = [new CartMock(1), new CartMock(2)];
