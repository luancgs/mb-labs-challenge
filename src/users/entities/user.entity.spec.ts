import { User } from './user.entity';

describe('User', () => {
  it('should be defined', () => {
    expect(new User()).toBeDefined();
  });

  it('should be initalized empty', () => {
    const user = new User();

    expect(user).toEqual({});
    expect(user).toBeInstanceOf(User);
  });
});
