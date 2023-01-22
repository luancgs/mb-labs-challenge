import { Injectable } from '@nestjs/common';
import { QrCodePix } from 'qrcode-pix';
import { CartGetDto } from '../carts/DTOs/cart.get.dto';
import { PixError } from './errors/pix.error';

@Injectable()
export class PaymentService {
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

    return value;
  }

  async generatePix(id: number, _message: string, _value: number) {
    const qrCodePix = QrCodePix({
      version: '01',
      key: '00000000000',
      name: 'Luan Carlos Gonçalves Silva',
      city: 'UBERLANDIA',
      transactionId: '***',
      message: _message,
      value: _value,
    });
    console.log(_value);

    try {
      return {
        payload: qrCodePix.payload(),
        qrCode: await qrCodePix.base64(),
      };
    } catch (error) {
      throw new PixError(error.message);
    }
  }
}
