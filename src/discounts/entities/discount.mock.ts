import { AdminMock } from '../../admins/entities/admin.mock';
import { EventMock } from '../../events/entities/event.mock';
import { DiscountGetDto } from '../DTOs/discount.get.dto';
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

  controller(): DiscountGetDto {
    return new DiscountGetDto(this);
  }

  service() {
    return this;
  }
}
