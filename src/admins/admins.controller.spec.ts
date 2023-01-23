import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Admin } from './admin.entity';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { AdminCreateError } from './errors/admin.create.error';
import { AdminDeleteError } from './errors/admin.delete.error';
import { AdminUpdateError } from './errors/admin.update.error';

describe('AdminsController', () => {
  let controller: AdminsController;
  let service: AdminsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminsController],
      providers: [
        {
          provide: AdminsService,
          useFactory: () => ({
            getAdmins: jest.fn(() => Promise.resolve(adminsDataMock)),
            getAdmin: jest.fn(() => Promise.resolve([adminsDataMock[0]])),
            createAdmin: jest.fn(() => Promise.resolve(null)),
            updateAdmin: jest.fn(() => Promise.resolve(null)),
            deleteAdmin: jest.fn(() => Promise.resolve(null)),
          }),
        },
      ],
    }).compile();

    controller = module.get<AdminsController>(AdminsController);
    service = module.get<AdminsService>(AdminsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('GET /admins', () => {
    it('should be defined', () => {
      expect(controller.getAll).toBeDefined();
    });

    it('should return admin objects', async () => {
      const result = await controller.getAll();
      expect(result[0]).toMatchObject(adminsDataMock[0]);
    });

    it('should get all admins', async () => {
      const result = await controller.getAll();
      expect(result.length).toBe(adminsDataMock.length);
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'getAdmins').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.getAll();
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('GET /admins/:id', () => {
    const adminId = 1;
    it('should be defined', () => {
      expect(controller.get).toBeDefined();
    });

    it('should return admin object', async () => {
      const result = await controller.get(adminId);
      expect(result[0]).toMatchObject(adminsDataMock[0]);
    });

    it('should get 1 admin', async () => {
      const result = await controller.get(adminId);
      expect(result.length).toBe(1);
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'getAdmin').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.get(adminId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('POST /admins', () => {
    const newAdmin: Admin = {
      id: 3,
      name: 'Ashley Johnson',
      email: 'ashleyjohnson@example.com',
      password: '$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq',
      createdAt: new Date(),
    };
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.create(newAdmin);
      expect(result).toEqual('admin created successfully');
    });

    it('should create 1 admin', async () => {
      await controller.create(newAdmin);
      const createAdmin = jest.spyOn(service, 'createAdmin');
      expect(createAdmin).toBeCalledTimes(1);
    });

    it('should throw Bad Request Error when error in body', async () => {
      jest.spyOn(service, 'createAdmin').mockImplementationOnce(() => {
        throw new AdminCreateError('body error');
      });
      try {
        await controller.create(newAdmin);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(400);
        expect(err.message).toContain('body error');
      }
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'createAdmin').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.create(newAdmin);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('PUT /admins/:id', () => {
    const id = 3;
    const partialAdmin: Partial<Admin> = {
      name: 'Ashley Jonas',
    };
    it('should be defined', () => {
      expect(controller.update).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.update(id, partialAdmin);
      expect(result).toEqual('admin updated successfully');
    });

    it('should update 1 admin', async () => {
      await controller.update(id, partialAdmin);
      const updateAdmin = jest.spyOn(service, 'updateAdmin');
      expect(updateAdmin).toBeCalledTimes(1);
    });

    it('should throw Bad Request Error when error in body', async () => {
      jest.spyOn(service, 'updateAdmin').mockImplementationOnce(() => {
        throw new AdminUpdateError('body error');
      });
      try {
        await controller.update(id, partialAdmin);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(400);
        expect(err.message).toContain('body error');
      }
    });

    it('should throw Internal Server Error when generic error ', async () => {
      jest.spyOn(service, 'updateAdmin').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.update(id, partialAdmin);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('DELETE /admins/:id', () => {
    const adminId = 3;
    it('should be defined', () => {
      expect(controller.delete).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.delete(adminId);
      expect(result).toEqual('admin deleted successfully');
    });

    it('should delete 1 admin', async () => {
      await controller.delete(adminId);
      const deleteAdmin = jest.spyOn(service, 'deleteAdmin');
      expect(deleteAdmin).toBeCalledTimes(1);
    });

    it('should throw Unprocessable Entity Error when id not found', async () => {
      jest.spyOn(service, 'deleteAdmin').mockImplementationOnce(() => {
        throw new AdminDeleteError('id error');
      });
      try {
        await controller.delete(adminId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(422);
        expect(err.message).toContain('id error');
      }
    });

    it('should throw Internal Server Error when generic error ', async () => {
      jest.spyOn(service, 'deleteAdmin').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.delete(adminId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });
});

const adminsDataMock: Admin[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq',
    createdAt: new Date(),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'janesmith@example.com',
    password: '$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq',
    createdAt: new Date(),
  },
];
