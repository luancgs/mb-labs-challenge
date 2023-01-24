import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { AdminsService } from './admins.service';
import { AdminCreateError } from './errors/admin.create.error';
import { AdminDeleteError } from './errors/admin.delete.error';
import { AdminUpdateError } from './errors/admin.update.error';
import { AdminMock } from './entities/admin.mock';

describe('AdminsService', () => {
  let service: AdminsService;
  let adminsRepository: Repository<Admin>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminsService,
        {
          provide: getRepositoryToken(Admin),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AdminsService>(AdminsService);
    adminsRepository = module.get<Repository<Admin>>(getRepositoryToken(Admin));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAdmins', () => {
    it('should return all admins', async () => {
      jest
        .spyOn(adminsRepository, 'find')
        .mockResolvedValueOnce(adminsDataMock);
      const result = await service.getAdmins();
      expect(result.length).toEqual(adminsDataMock.length);
    });

    it('should return admins objects', async () => {
      jest
        .spyOn(adminsRepository, 'find')
        .mockResolvedValueOnce(adminsDataMock);
      const result = await service.getAdmins();
      expect(result[0]).toMatchObject(adminsDataMock[0]);
    });

    it('must throw errors', async () => {
      jest.spyOn(adminsRepository, 'find').mockImplementation(() => {
        throw new Error('async error');
      });
      try {
        await service.getAdmins();
      } catch (err) {
        expect(err.message).toContain('async error');
      }
    });
  });

  describe('getAdmin', () => {
    const adminId = 1;
    it('should return only 1 admin', async () => {
      jest
        .spyOn(adminsRepository, 'find')
        .mockResolvedValueOnce([adminsDataMock[0]]);
      const result = await service.getAdmin(adminId);
      expect(result.length).toEqual(1);
    });

    it('should return admin object', async () => {
      jest
        .spyOn(adminsRepository, 'find')
        .mockResolvedValueOnce([adminsDataMock[0]]);
      const result = await service.getAdmin(adminId);
      expect(result[0]).toMatchObject(adminsDataMock[0]);
    });

    it('should return correct admin', async () => {
      jest
        .spyOn(adminsRepository, 'find')
        .mockResolvedValueOnce([adminsDataMock[0]]);
      const result = await service.getAdmin(adminId);
      expect(result[0].id).toEqual(adminId);
    });

    it('must throw errors', async () => {
      jest.spyOn(adminsRepository, 'find').mockImplementation(() => {
        throw new Error('async error');
      });
      try {
        await service.getAdmin(adminId);
      } catch (err) {
        expect(err.message).toContain('async error');
      }
    });
  });

  describe('getAdminLogin', () => {
    it('must throw errors', async () => {
      jest.spyOn(adminsRepository, 'find').mockImplementation(() => {
        throw new Error('async error');
      });
      try {
        await service.getAdmins();
      } catch (err) {
        expect(err.message).toContain('async error');
      }
    });
  });

  describe('createAdmin', () => {
    const newAdmin: Admin = {
      id: 3,
      name: 'Ashley Johnson',
      email: 'ashleyjohnson@example.com',
      password: '$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq',
      createdAt: new Date(),
    };

    it('should insert admin', async () => {
      const insert = jest
        .spyOn(adminsRepository, 'insert')
        .mockResolvedValueOnce(null);
      await service.createAdmin(newAdmin);
      expect(insert).toBeCalled();
      expect(insert).toBeCalledTimes(1);
      expect(insert).toBeCalledWith(newAdmin);
    });

    it('should return void promise', async () => {
      jest.spyOn(adminsRepository, 'insert').mockResolvedValueOnce(null);
      const result = await service.createAdmin(newAdmin);
      expect(result).toBeUndefined();
    });

    it('must throw AdminCreateErrors errors', async () => {
      jest.spyOn(adminsRepository, 'insert').mockImplementation(() => {
        throw new QueryFailedError('query error', ['a'], 'query error');
      });
      try {
        await service.createAdmin(newAdmin);
      } catch (err) {
        expect(err).toBeInstanceOf(AdminCreateError);
        expect(err.message).toContain('query error');
      }
    });

    it('must throw generic errors', async () => {
      jest.spyOn(adminsRepository, 'insert').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.createAdmin(newAdmin);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('updateAdmin', () => {
    const id = 3;
    const partialAdmin: Partial<Admin> = {
      name: 'Ashley Jonas',
    };

    it('should update admin', async () => {
      const update = jest
        .spyOn(adminsRepository, 'update')
        .mockResolvedValueOnce(null);
      await service.updateAdmin(id, partialAdmin);
      expect(update).toBeCalled();
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(id, partialAdmin);
    });

    it('should return void promise', async () => {
      jest.spyOn(adminsRepository, 'update').mockResolvedValueOnce(null);
      const result = await service.updateAdmin(id, partialAdmin);
      expect(result).toBeUndefined();
    });

    it('should throw AdminUpdateErrors errors', async () => {
      jest.spyOn(adminsRepository, 'update').mockImplementation(() => {
        throw new QueryFailedError('query error', ['a'], 'query error');
      });
      try {
        await service.updateAdmin(id, partialAdmin);
      } catch (err) {
        expect(err).toBeInstanceOf(AdminUpdateError);
        expect(err.message).toContain('query error');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(adminsRepository, 'update').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.updateAdmin(id, partialAdmin);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('deleteAdmin', () => {
    const id = 3;

    it('should delete admin', async () => {
      const deleteResult = jest
        .spyOn(adminsRepository, 'delete')
        .mockResolvedValueOnce({
          raw: [],
          affected: 1,
        });
      await service.deleteAdmin(id);
      expect(deleteResult).toBeCalled();
      expect(deleteResult).toBeCalledTimes(1);
      expect(deleteResult).toBeCalledWith(id);
    });

    it('should return void promise', async () => {
      jest.spyOn(adminsRepository, 'delete').mockResolvedValueOnce({
        raw: [],
        affected: 1,
      });
      const result = await service.deleteAdmin(id);
      expect(result).toBeUndefined();
    });

    it('must throw AdminDeleteError when invalid id', async () => {
      jest.spyOn(adminsRepository, 'delete').mockResolvedValueOnce({
        raw: [],
        affected: 0,
      });
      try {
        await service.deleteAdmin(id);
      } catch (err) {
        expect(err).toBeInstanceOf(AdminDeleteError);
        expect(err.message).toContain('admin id not found');
      }
    });

    it('must throw generic errors', async () => {
      jest.spyOn(adminsRepository, 'delete').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.deleteAdmin(id);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });
});

const adminsDataMock: Admin[] = [new AdminMock(1), new AdminMock(2)];
