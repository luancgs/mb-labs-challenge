import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { DiscountGetDto } from './DTOs/discount.get.dto';
import { Discount } from './entities/discount.entity';
import { DiscountMock } from './entities/discount.mock';
import { DiscountCreateError } from './errors/discount.create.error';
import { DiscountDeleteError } from './errors/discount.delete.error';
import { DiscountUpdateError } from './errors/discount.update.error';

describe('DiscountsController', () => {
  let controller: DiscountsController;
  let service: DiscountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountsController],
      providers: [
        {
          provide: DiscountsService,
          useFactory: () => ({
            getDiscounts: jest.fn(() => Promise.resolve(discountsDataMock)),
            getDiscountById: jest.fn(() =>
              Promise.resolve([discountsDataMock[0]]),
            ),
            createDiscount: jest.fn(() => Promise.resolve(null)),
            updateDiscount: jest.fn(() => Promise.resolve(null)),
            deleteDiscount: jest.fn(() => Promise.resolve(null)),
          }),
        },
      ],
    }).compile();

    controller = module.get<DiscountsController>(DiscountsController);
    service = module.get<DiscountsService>(DiscountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('GET /discounts', () => {
    it('should be defined', () => {
      expect(controller.getAll).toBeDefined();
    });

    it('should return discount objects', async () => {
      const result = await controller.getAll();
      expect(result[0]).toMatchObject(discountsDataMock[0]);
      expect(result[0]).toBeInstanceOf(DiscountGetDto);
    });

    it('should get all discounts', async () => {
      const result = await controller.getAll();
      expect(result.length).toBe(discountsDataMock.length);
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'getDiscounts').mockImplementationOnce(() => {
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

  describe('GET /discounts/:id', () => {
    const discountId = 1;
    it('should be defined', () => {
      expect(controller.getById).toBeDefined();
    });

    it('should return discount object', async () => {
      const result = await controller.getById(discountId);
      expect(result[0]).toMatchObject(discountsDataMock[0]);
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'getDiscountById').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.getById(discountId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('POST /discounts', () => {
    const newDiscount: Discount = new DiscountMock(3);
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.create(newDiscount);
      expect(result).toEqual('discount created successfully');
    });

    it('should create 1 discount', async () => {
      await controller.create(newDiscount);
      const createDiscount = jest.spyOn(service, 'createDiscount');
      expect(createDiscount).toBeCalledTimes(1);
    });

    it('should throw Bad Request Error when error in body', async () => {
      jest.spyOn(service, 'createDiscount').mockImplementationOnce(() => {
        throw new DiscountCreateError('body error');
      });
      try {
        await controller.create(newDiscount);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(400);
        expect(err.message).toContain('body error');
      }
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'createDiscount').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.create(newDiscount);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('PUT /discounts/:id', () => {
    const id = 3;
    const partialDiscount: Partial<Discount> = {
      code: 'mockCode',
    };
    it('should be defined', () => {
      expect(controller.update).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.update(id, partialDiscount);
      expect(result).toEqual('discount updated successfully');
    });

    it('should update 1 discount', async () => {
      await controller.update(id, partialDiscount);
      const updateDiscount = jest.spyOn(service, 'updateDiscount');
      expect(updateDiscount).toBeCalledTimes(1);
    });

    it('should throw Bad Request Error when error in body', async () => {
      jest.spyOn(service, 'updateDiscount').mockImplementationOnce(() => {
        throw new DiscountUpdateError('body error');
      });
      try {
        await controller.update(id, partialDiscount);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(400);
        expect(err.message).toContain('body error');
      }
    });

    it('should throw Internal Server Error when generic error ', async () => {
      jest.spyOn(service, 'updateDiscount').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.update(id, partialDiscount);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('DELETE /discounts/:id', () => {
    const discountId = 3;
    it('should be defined', () => {
      expect(controller.delete).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.delete(discountId);
      expect(result).toEqual('discount deleted successfully');
    });

    it('should delete 1 discount', async () => {
      await controller.delete(discountId);
      const deleteDiscount = jest.spyOn(service, 'deleteDiscount');
      expect(deleteDiscount).toBeCalledTimes(1);
    });

    it('should throw Unprocessable Entity Error when id not found', async () => {
      jest.spyOn(service, 'deleteDiscount').mockImplementationOnce(() => {
        throw new DiscountDeleteError('id error');
      });
      try {
        await controller.delete(discountId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(422);
        expect(err.message).toContain('id error');
      }
    });

    it('should throw Internal Server Error when generic error ', async () => {
      jest.spyOn(service, 'deleteDiscount').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.delete(discountId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });
});

const discountsDataMock: DiscountGetDto[] = [
  new DiscountMock(1).controller(),
  new DiscountMock(2).controller(),
];
