import { Cart } from './cart.entity';

describe('Cart', () => {
  it('should be defined', () => {
    expect(new Cart()).toBeDefined();
  });

  it('should be initalized empty', () => {
    const cart = new Cart();

    expect(cart).toEqual({});
    expect(cart).toBeInstanceOf(Cart);
  });
});
