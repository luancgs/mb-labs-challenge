import { DiscountGetDto } from 'src/discounts/DTOs/discount.get.dto';
import { EventGetDto } from 'src/events/DTOs/event.get.dto';
import { Ticket } from '../entities/ticket.entity';

export class TicketGetDto {
  id: number;
  boughtAt: Date;
  event: EventGetDto;
  user: number;
  discount: DiscountGetDto;
  constructor(ticket: Ticket) {
    this.id = ticket.id;
    this.boughtAt = ticket.boughtAt;
    this.event = new EventGetDto(ticket.event);
    this.user = ticket.user.id;
    this.discount =
      ticket.discount === null ? null : new DiscountGetDto(ticket.discount);
  }
}
