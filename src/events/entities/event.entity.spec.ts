import { Event } from './event.entity';

describe('Event', () => {
  it('should be defined', () => {
    expect(new Event()).toBeDefined();
  });

  it('should be initalized empty', () => {
    const event = new Event();

    expect(event).toEqual({});
    expect(event).toBeInstanceOf(Event);
  });
});
