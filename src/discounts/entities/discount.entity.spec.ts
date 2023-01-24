import { Discount } from './discount.entity';

describe('Discount', () => {
  it('should be defined', () => {
    expect(new Discount()).toBeDefined();
  });

  it('should be initalized empty', () => {
    const discount = new Discount();

    expect(discount).toEqual({});
    expect(discount).toBeInstanceOf(Discount);
  });
});
