import { Cart } from '../cart.entity';
import { Discount } from '../../discounts/discount.entity';
import { EventGetDto } from '../../events/DTOs/event.get.dto';

export class CartGetDto {
  id: number;
  quantity: number;
  event: EventGetDto;
  user: number;
  discount: CartDiscount;

  constructor(cart: Cart) {
    this.id = cart.id;
    this.quantity = cart.quantity;
    this.user = cart.user.id;
    this.event = new EventGetDto(cart.event);

    if (cart.discount !== null) {
      this.discount = new CartDiscount(cart.discount);
    } else {
      this.discount = cart.discount;
    }
  }
}

class CartDiscount {
  id: number;
  code: string;
  value: number;

  constructor(discount: Discount) {
    this.id = discount.id;
    this.code = discount.code;
    this.value = discount.value;
  }
}
