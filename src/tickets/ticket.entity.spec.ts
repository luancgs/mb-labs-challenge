import { Ticket } from './ticket.entity';

describe('TicketEntity', () => {
  it('should be defined', () => {
    expect(new Ticket()).toBeDefined();
  });
});
