import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminMock } from '../../admins/entities/admin.mock';
import { AdminsService } from '../../admins/admins.service';
import { AdminAuthService } from './admin.auth.service';

describe('AuthService', () => {
  let service: AdminAuthService;
  let adminsService: AdminsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminAuthService,
        {
          provide: AdminsService,
          useFactory: () => ({
            getAdminLogin: jest.fn(() => Promise.resolve(new AdminMock(1))),
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

    service = module.get<AdminAuthService>(AdminAuthService);
    adminsService = module.get<AdminsService>(AdminsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    const email = 'mockEmail';
    const password = 'password';
    it('should return admin with no password if admin is valid', async () => {
      const result = await service.validate(email, password);
      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('email');
    });

    it('should return null if admin is invalid', async () => {
      jest
        .spyOn(adminsService, 'getAdminLogin')
        .mockImplementationOnce(async () => {
          return Promise.resolve(null);
        });
      const result = await service.validate('notvalid', password);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    const admin = {
      email: 'mockEmail',
      id: 1,
    };
    it('should return access_token', async () => {
      const result = await service.login(admin);
      expect(result).toHaveProperty('access_token');
    });
  });
});
