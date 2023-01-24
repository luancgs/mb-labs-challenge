import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthService } from './user.auth.service';
import { UserMock } from '../../users/entities/user.mock';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('UserAuthService', () => {
  let service: UserAuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthService,
        {
          provide: UsersService,
          useFactory: () => ({
            getUserLogin: jest.fn(() => Promise.resolve(new UserMock(1))),
          }),
        },
        {
          provide: JwtService,
          useFactory: () => ({
            sign: jest.fn(() => Promise.resolve('mockSign')),
          }),
        },
      ],
    }).compile();

    service = module.get<UserAuthService>(UserAuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    const email = 'mockEmail';
    const password = 'password';
    it('should return user with no password if user is valid', async () => {
      const result = await service.validate(email, password);
      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('email');
    });

    it('should return null if user is invalid', async () => {
      jest
        .spyOn(usersService, 'getUserLogin')
        .mockImplementationOnce(async () => {
          return Promise.resolve(null);
        });
      const result = await service.validate('notvalid', password);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    const user = {
      email: 'mockEmail',
      id: 1,
    };
    it('should return access_token', async () => {
      const result = await service.login(user);
      expect(result).toHaveProperty('access_token');
    });
  });
});
