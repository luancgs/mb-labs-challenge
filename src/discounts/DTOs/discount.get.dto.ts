import { Discount } from '../discount.entity';
import { Event } from '../../events/event.entity';

export class DiscountGetDto {
  id: number;
  code: string;
  value: number;
  event: DiscountEvent;

  constructor(discount: Discount) {
    this.id = discount.id;
    this.code = discount.code;
    this.value = discount.value;
    this.event = new DiscountEvent(discount.event);
  }
}

class DiscountEvent {
  id: number;
  title: string;
  date: Date;
  price: number;
  constructor(event: Event) {
    this.id = event.id;
    this.title = event.title;
    this.date = event.date;
    this.price = event.price;
  }
}
