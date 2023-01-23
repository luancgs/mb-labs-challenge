import { DiscountMock } from 'src/discounts/entities/discount.mock';
import { EventMock } from 'src/events/entities/event.mock';
import { UserMock } from 'src/users/entities/user.mock';
import { Cart } from './cart.entity';

export class CartMock extends Cart {
  constructor(id: number) {
    super();
    this.id = id;
    this.quantity = 1;
    this.event = new EventMock(1);
    this.user = new UserMock(1);
    this.discount = new DiscountMock(1);
  }
}
