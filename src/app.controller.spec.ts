import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AdminAuthService } from './auth/admin/admin.auth.service';
import { UserAuthService } from './auth/user/user.auth.service';

describe('AppController', () => {
  let controller: AppController;
  let userAuthService: UserAuthService;
  let adminAuthService: AdminAuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: UserAuthService,
          useFactory: () => ({
            login: jest.fn(() =>
              Promise.resolve({
                access_token: 'mockToken',
              }),
            ),
          }),
        },
        {
          provide: AdminAuthService,
          useFactory: () => ({
            login: jest.fn(() =>
              Promise.resolve({
                access_token: 'mockToken',
              }),
            ),
          }),
        },
      ],
    }).compile();

    controller = app.get<AppController>(AppController);
    userAuthService = app.get<UserAuthService>(UserAuthService);
    adminAuthService = app.get<AdminAuthService>(AdminAuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /auth/user', () => {
    const userReq = {};
    it('should be defined', () => {
      expect(controller.loginUser).toBeDefined();
    });

    it('should return access token', async () => {
      const result = await controller.loginUser(userReq);
      expect(result).toHaveProperty('access_token');
    });
  });

  describe('POST /auth/admin', () => {
    const adminReq = {};
    it('should be defined', () => {
      expect(controller.loginAdmin).toBeDefined();
    });

    it('should return access token', async () => {
      const result = await controller.loginAdmin(adminReq);
      expect(result).toHaveProperty('access_token');
    });
  });
});
