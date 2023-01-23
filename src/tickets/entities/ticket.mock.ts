import { DiscountMock } from '../../discounts/entities/discount.mock';
import { EventMock } from '../../events/entities/event.mock';
import { UserMock } from '../../users/entities/user.mock';
import { Ticket } from './ticket.entity';

export class TicketMock extends Ticket {
  constructor(id: number) {
    super();
    this.id = id;
    this.boughtAt = new Date();
    this.event = new EventMock(1);
    this.user = new UserMock(1);
    this.discount = new DiscountMock(1);
  }
}
