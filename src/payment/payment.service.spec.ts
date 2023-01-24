import { Test, TestingModule } from '@nestjs/testing';
import { CartGetDto } from '../carts/DTOs/cart.get.dto';
import { CartMock } from '../carts/entities/cart.mock';
import { PaymentMethodError } from './errors/payment.method.error';
import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateCartValue', () => {
    it('should be defined', () => {
      expect(service.calculateCartValue).toBeDefined();
    });

    it('should return a integer', () => {
      const value = service.calculateCartValue([
        new CartGetDto(new CartMock(1)),
      ]);

      expect(value).toBeDefined();
      expect(value).toBe(179); //Event Price: 1.99 - Discount 10%
    });
  });

  describe('createPaymentIntent', () => {
    it('should return intent id', async () => {
      jest
        .spyOn(service.stripe.paymentIntents, 'create')
        .mockResolvedValue({ id: 'mockIntentId' } as any);
      const result = await service.createPaymentIntent(179);

      expect(result).toBeDefined();
      expect(result).toEqual('mockIntentId');
    });

    it('should throw errors', async () => {
      jest
        .spyOn(service.stripe.paymentIntents, 'create')
        .mockImplementationOnce(() => {
          throw new Error('mock error');
        });

      try {
        await service.createPaymentIntent(179);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err.message).toContain('mock error');
      }
    });
  });

  describe('createPaymentMethodCard', () => {
    it('should return method id', async () => {
      jest
        .spyOn(service.stripe.paymentMethods, 'create')
        .mockResolvedValue({ id: 'mockMethodId' } as any);
      const result = await service.createPaymentMethodCard({} as any);

      expect(result).toBeDefined();
      expect(result).toEqual('mockMethodId');
    });

    it('should throw errors', async () => {
      jest
        .spyOn(service.stripe.paymentMethods, 'create')
        .mockImplementationOnce(() => {
          throw new Error('mock error');
        });

      try {
        await service.createPaymentMethodCard({} as any);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err.message).toContain('mock error');
      }
    });
  });

  describe('createPaymentMethodBoleto', () => {
    it('should return method id', async () => {
      jest
        .spyOn(service.stripe.paymentMethods, 'create')
        .mockResolvedValue({ id: 'mockMethodId' } as any);
      const result = await service.createPaymentMethodBoleto({} as any);

      expect(result).toBeDefined();
      expect(result).toEqual('mockMethodId');
    });

    it('should throw errors', async () => {
      jest
        .spyOn(service.stripe.paymentMethods, 'create')
        .mockImplementationOnce(() => {
          throw new Error('mock error');
        });

      try {
        await service.createPaymentMethodBoleto({} as any);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err.message).toContain('mock error');
      }
    });
  });

  describe('confirmPaymentIntent', () => {
    it('should return void promise', async () => {
      const func = jest
        .spyOn(service.stripe.paymentIntents, 'confirm')
        .mockResolvedValue(null);
      const result = await service.confirmPaymentIntent('intentId', 'methodId');

      expect(result).toBeUndefined();
      expect(func).toBeCalledTimes(1);
    });
  });

  describe('executePayment', () => {
    it('should return void promise', async () => {
      jest
        .spyOn(service.stripe.paymentIntents, 'create')
        .mockResolvedValue({ id: 'mockIntentId' } as any);
      jest
        .spyOn(service.stripe.paymentMethods, 'create')
        .mockResolvedValue({ id: 'mockMethodId' } as any);
      const confirmFunc = jest
        .spyOn(service.stripe.paymentIntents, 'confirm')
        .mockResolvedValue(null);

      const result = await service.executePayment(179, 'card', {});

      expect(result).toBeUndefined();
      expect(confirmFunc).toBeCalledTimes(1);
    });

    it('should throw PaymentMethod Error case invalid paymentMethod', async () => {
      jest
        .spyOn(service.stripe.paymentIntents, 'create')
        .mockResolvedValue({ id: 'mockIntentId' } as any);
      jest
        .spyOn(service.stripe.paymentIntents, 'confirm')
        .mockResolvedValue(null);

      try {
        await service.executePayment(179, 'invalid payment', {});
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(PaymentMethodError);
        expect(err.message).toContain('invalid payment method');
      }
    });
  });
});
