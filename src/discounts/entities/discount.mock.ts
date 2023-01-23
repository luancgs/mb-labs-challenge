import { AdminMock } from 'src/admins/entities/admin.mock';
import { EventMock } from 'src/events/entities/event.mock';
import { Discount } from './discount.entity';

export class DiscountMock extends Discount {
  constructor(id: number) {
    super();
    this.id = id;
    this.code = (Math.random() + 1).toString(36).substring(7);
    this.value = 10;
    this.event = new EventMock(1);
    this.admin = new AdminMock(1);
  }
}
