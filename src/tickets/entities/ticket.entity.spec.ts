import { Ticket } from './ticket.entity';

describe('Ticket', () => {
  it('should be defined', () => {
    expect(new Ticket()).toBeDefined();
  });

  it('should be initalized empty', () => {
    const ticket = new Ticket();

    expect(ticket).toEqual({});
    expect(ticket).toBeInstanceOf(Ticket);
  });
});
