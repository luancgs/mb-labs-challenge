import { Injectable } from '@nestjs/common';
import { CartGetDto } from '../carts/DTOs/cart.get.dto';
import { PaymentMethodError } from './errors/payment.method.error';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }
  calculateCartValue(cart: CartGetDto[]): number {
    let value = 0;
    for (const item of cart) {
      if (item.discount !== null) {
        value +=
          item.event.price *
          ((100 - item.discount.value) / 100) *
          item.quantity;
      } else {
        value += item.event.price * item.quantity;
      }
    }

    return Math.round(value * 100);
  }

  async createPaymentIntent(value: number) {
    try {
      const intent = await this.stripe.paymentIntents.create({
        amount: value,
        currency: 'brl',
        payment_method_types: ['card', 'boleto'],
      });
      return intent.id;
    } catch (error) {
      throw error;
    }
  }

  async createPaymentMethodCard(data: Stripe.PaymentMethodCreateParams.Card1) {
    try {
      const method = await this.stripe.paymentMethods.create({
        card: {
          exp_month: data.exp_month,
          exp_year: data.exp_year,
          number: data.number,
          cvc: data.cvc,
        },
        type: 'card',
      });
      return method.id;
    } catch (error) {
      throw error;
    }
  }

  async createPaymentMethodBoleto(data: any) {
    try {
      const method = await this.stripe.paymentMethods.create({
        boleto: {
          tax_id: data.tax_id,
        },
        billing_details: {
          email: data.email,
        },
        type: 'boleto',
      });
      return method.id;
    } catch (error) {
      throw error;
    }
  }

  async executePayment(value: number, method: string, data: any) {
    const paymentIntentId = await this.createPaymentIntent(value);

    let paymentMethodId: string;
    if (method === 'card') {
      paymentMethodId = await this.createPaymentMethodCard(data);
    } else if (method === 'boleto') {
      paymentMethodId = await this.createPaymentMethodBoleto(data);
    } else {
      throw new PaymentMethodError('invalid payment method');
    }

    return await this.confirmPaymentIntent(paymentIntentId, paymentMethodId);
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethod: string) {
    await this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethod,
    });
  }
}
