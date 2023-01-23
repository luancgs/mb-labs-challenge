import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { DiscountsService } from './discounts.service';
import { DiscountGetDto } from './DTOs/discount.get.dto';
import { Discount } from './entities/discount.entity';
import { DiscountMock } from './entities/discount.mock';
import { DiscountCreateError } from './errors/discount.create.error';
import { DiscountDeleteError } from './errors/discount.delete.error';
import { DiscountUpdateError } from './errors/discount.update.error';

describe('DiscountsService', () => {
  let service: DiscountsService;
  let discountsRepository: Repository<Discount>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscountsService,
        {
          provide: getRepositoryToken(Discount),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DiscountsService>(DiscountsService);
    discountsRepository = module.get<Repository<Discount>>(
      getRepositoryToken(Discount),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDiscounts', () => {
    it('should return all discounts', async () => {
      jest
        .spyOn(discountsRepository, 'find')
        .mockResolvedValueOnce(discountsDataMock);
      const result = await service.getDiscounts();
      expect(result.length).toEqual(discountsDataMock.length);
    });

    it('should return DiscountGetDto objects', async () => {
      jest
        .spyOn(discountsRepository, 'find')
        .mockResolvedValueOnce(discountsDataMock);
      const result = await service.getDiscounts();
      expect(result[0]).toMatchObject(new DiscountGetDto(discountsDataMock[0]));
    });

    it('should throw errors', async () => {
      jest.spyOn(discountsRepository, 'find').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.getDiscounts();
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('getDiscountById', () => {
    const discountId = 1;

    it('should return DiscountGetDto object', async () => {
      jest
        .spyOn(discountsRepository, 'findOne')
        .mockResolvedValueOnce(discountsDataMock[0]);
      const result = await service.getDiscountById(discountId);
      expect(result).toMatchObject(new DiscountGetDto(discountsDataMock[0]));
    });

    it('should return correct discount', async () => {
      jest
        .spyOn(discountsRepository, 'findOne')
        .mockResolvedValueOnce(discountsDataMock[0]);
      const result = await service.getDiscountById(discountId);
      expect(result.id).toEqual(discountId);
    });

    it('should throw errors', async () => {
      jest.spyOn(discountsRepository, 'findOne').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.getDiscountById(discountId);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('getDiscountByEvent', () => {
    const eventId = 1;
    it('should return all discounts', async () => {
      jest
        .spyOn(discountsRepository, 'find')
        .mockResolvedValueOnce(discountsDataMock);
      const result = await service.getDiscountByEvent(eventId);
      expect(result.length).toEqual(discountsDataMock.length);
    });
    it('should return DiscountGetDto object', async () => {
      jest
        .spyOn(discountsRepository, 'find')
        .mockResolvedValueOnce(discountsDataMock);
      const result = await service.getDiscountByEvent(eventId);
      expect(result[0]).toBeInstanceOf(DiscountGetDto);
    });

    it('should throw errors', async () => {
      jest.spyOn(discountsRepository, 'find').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.getDiscountByEvent(eventId);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('createDiscount', () => {
    const newDiscount: Discount = new DiscountMock(3);

    it('should insert discount', async () => {
      const insert = jest
        .spyOn(discountsRepository, 'insert')
        .mockResolvedValueOnce(null);
      await service.createDiscount(newDiscount);
      expect(insert).toBeCalled();
      expect(insert).toBeCalledTimes(1);
      expect(insert).toBeCalledWith(newDiscount);
    });

    it('should return void promise', async () => {
      jest.spyOn(discountsRepository, 'insert').mockResolvedValueOnce(null);
      const result = await service.createDiscount(newDiscount);
      expect(result).toBeUndefined();
    });

    it('should throw DiscountCreateErrors errors', async () => {
      jest.spyOn(discountsRepository, 'insert').mockImplementation(() => {
        throw new QueryFailedError('query error', ['a'], 'query error');
      });
      try {
        await service.createDiscount(newDiscount);
      } catch (err) {
        expect(err).toBeInstanceOf(DiscountCreateError);
        expect(err.message).toContain('query error');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(discountsRepository, 'insert').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.createDiscount(newDiscount);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('updateDiscount', () => {
    const id = 3;
    const partialDiscount: Partial<Discount> = {
      code: 'mockCode',
    };

    it('should update discount', async () => {
      const update = jest
        .spyOn(discountsRepository, 'update')
        .mockResolvedValueOnce(null);
      await service.updateDiscount(id, partialDiscount);
      expect(update).toBeCalled();
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(id, partialDiscount);
    });

    it('should return void promise', async () => {
      jest.spyOn(discountsRepository, 'update').mockResolvedValueOnce(null);
      const result = await service.updateDiscount(id, partialDiscount);
      expect(result).toBeUndefined();
    });

    it('should throw DiscountUpdateErrors errors', async () => {
      jest.spyOn(discountsRepository, 'update').mockImplementation(() => {
        throw new QueryFailedError('query error', ['a'], 'query error');
      });
      try {
        await service.updateDiscount(id, partialDiscount);
      } catch (err) {
        expect(err).toBeInstanceOf(DiscountUpdateError);
        expect(err.message).toContain('query error');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(discountsRepository, 'update').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.updateDiscount(id, partialDiscount);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('deleteDiscount', () => {
    const id = 3;

    it('should delete discount', async () => {
      const deleteResult = jest
        .spyOn(discountsRepository, 'delete')
        .mockResolvedValueOnce({
          raw: [],
          affected: 1,
        });
      await service.deleteDiscount(id);
      expect(deleteResult).toBeCalled();
      expect(deleteResult).toBeCalledTimes(1);
      expect(deleteResult).toBeCalledWith(id);
    });

    it('should return void promise', async () => {
      jest.spyOn(discountsRepository, 'delete').mockResolvedValueOnce({
        raw: [],
        affected: 1,
      });
      const result = await service.deleteDiscount(id);
      expect(result).toBeUndefined();
    });

    it('should throw DiscountDeleteError when invalid id', async () => {
      jest.spyOn(discountsRepository, 'delete').mockResolvedValueOnce({
        raw: [],
        affected: 0,
      });
      try {
        await service.deleteDiscount(id);
      } catch (err) {
        expect(err).toBeInstanceOf(DiscountDeleteError);
        expect(err.message).toContain('discount id not found');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(discountsRepository, 'delete').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.deleteDiscount(id);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });
});

const discountsDataMock: Discount[] = [
  new DiscountMock(1),
  new DiscountMock(2),
];
