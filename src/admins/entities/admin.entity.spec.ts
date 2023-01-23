import { Admin } from './admin.entity';

describe('Admin', () => {
  it('should be defined', () => {
    expect(new Admin()).toBeDefined();
  });

  it('should be initalized empty', () => {
    const admin = new Admin();

    expect(admin).toEqual({});
    expect(admin).toBeInstanceOf(Admin);
  });
});
