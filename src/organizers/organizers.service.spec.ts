import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { OrganizerGetDto } from './DTOs/organizer.get.dto';
import { Organizer } from './entities/organizer.entity';
import { OrganizerMock } from './entities/organizer.mock';
import { OrganizerCreateError } from './errors/organizer.create.error';
import { OrganizerDeleteError } from './errors/organizer.delete.error';
import { OrganizerUpdateError } from './errors/organizer.update.error';
import { OrganizersService } from './organizers.service';

describe('OrganizersService', () => {
  let service: OrganizersService;
  let organizersRepository: Repository<Organizer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizersService,
        {
          provide: getRepositoryToken(Organizer),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OrganizersService>(OrganizersService);
    organizersRepository = module.get<Repository<Organizer>>(
      getRepositoryToken(Organizer),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrganizers', () => {
    it('should return all organizers', async () => {
      jest
        .spyOn(organizersRepository, 'find')
        .mockResolvedValueOnce(organizersDataMock);
      const result = await service.getOrganizers();
      expect(result.length).toEqual(organizersDataMock.length);
    });

    it('should return OrganizerGetDto objects', async () => {
      jest
        .spyOn(organizersRepository, 'find')
        .mockResolvedValueOnce(organizersDataMock);
      const result = await service.getOrganizers();
      expect(result[0]).toMatchObject(
        new OrganizerGetDto(organizersDataMock[0]),
      );
      expect(result[0]).toBeInstanceOf(OrganizerGetDto);
    });

    it('should throw errors', async () => {
      jest.spyOn(organizersRepository, 'find').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.getOrganizers();
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('getOrganizer', () => {
    const organizerId = 1;

    it('should return OrganizerGetDto object', async () => {
      jest
        .spyOn(organizersRepository, 'findOne')
        .mockResolvedValueOnce(organizersDataMock[0]);
      const result = await service.getOrganizer(organizerId);
      expect(result).toMatchObject(new OrganizerGetDto(organizersDataMock[0]));
      expect(result).toBeInstanceOf(OrganizerGetDto);
    });

    it('should return correct organizer', async () => {
      jest
        .spyOn(organizersRepository, 'findOne')
        .mockResolvedValueOnce(organizersDataMock[0]);
      const result = await service.getOrganizer(organizerId);
      expect(result.id).toEqual(organizerId);
    });

    it('should throw errors', async () => {
      jest.spyOn(organizersRepository, 'findOne').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.getOrganizer(organizerId);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('createOrganizer', () => {
    const newOrganizer: Organizer = new OrganizerMock(3);

    it('should insert organizer', async () => {
      const insert = jest
        .spyOn(organizersRepository, 'insert')
        .mockResolvedValueOnce(null);
      await service.createOrganizer(newOrganizer);
      expect(insert).toBeCalled();
      expect(insert).toBeCalledTimes(1);
      expect(insert).toBeCalledWith(newOrganizer);
    });

    it('should return void promise', async () => {
      jest.spyOn(organizersRepository, 'insert').mockResolvedValueOnce(null);
      const result = await service.createOrganizer(newOrganizer);
      expect(result).toBeUndefined();
    });

    it('should throw OrganizerCreateErrors errors', async () => {
      jest.spyOn(organizersRepository, 'insert').mockImplementation(() => {
        throw new QueryFailedError('query error', ['a'], 'query error');
      });
      try {
        await service.createOrganizer(newOrganizer);
      } catch (err) {
        expect(err).toBeInstanceOf(OrganizerCreateError);
        expect(err.message).toContain('query error');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(organizersRepository, 'insert').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.createOrganizer(newOrganizer);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('updateOrganizer', () => {
    const id = 3;
    const partialOrganizer: Partial<Organizer> = {
      name: 'mock organizer',
    };

    it('should update organizer', async () => {
      const update = jest
        .spyOn(organizersRepository, 'update')
        .mockResolvedValueOnce(null);
      await service.updateOrganizer(id, partialOrganizer);
      expect(update).toBeCalled();
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(id, partialOrganizer);
    });

    it('should return void promise', async () => {
      jest.spyOn(organizersRepository, 'update').mockResolvedValueOnce(null);
      const result = await service.updateOrganizer(id, partialOrganizer);
      expect(result).toBeUndefined();
    });

    it('should throw OrganizerUpdateErrors errors', async () => {
      jest.spyOn(organizersRepository, 'update').mockImplementation(() => {
        throw new QueryFailedError('query error', ['a'], 'query error');
      });
      try {
        await service.updateOrganizer(id, partialOrganizer);
      } catch (err) {
        expect(err).toBeInstanceOf(OrganizerUpdateError);
        expect(err.message).toContain('query error');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(organizersRepository, 'update').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.updateOrganizer(id, partialOrganizer);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });

  describe('deleteOrganizer', () => {
    const id = 3;

    it('should delete organizer', async () => {
      const deleteResult = jest
        .spyOn(organizersRepository, 'delete')
        .mockResolvedValueOnce({
          raw: [],
          affected: 1,
        });
      await service.deleteOrganizer(id);
      expect(deleteResult).toBeCalled();
      expect(deleteResult).toBeCalledTimes(1);
      expect(deleteResult).toBeCalledWith(id);
    });

    it('should return void promise', async () => {
      jest.spyOn(organizersRepository, 'delete').mockResolvedValueOnce({
        raw: [],
        affected: 1,
      });
      const result = await service.deleteOrganizer(id);
      expect(result).toBeUndefined();
    });

    it('should throw OrganizerDeleteError when invalid id', async () => {
      jest.spyOn(organizersRepository, 'delete').mockResolvedValueOnce({
        raw: [],
        affected: 0,
      });
      try {
        await service.deleteOrganizer(id);
      } catch (err) {
        expect(err).toBeInstanceOf(OrganizerDeleteError);
        expect(err.message).toContain('organizer id not found');
      }
    });

    it('should throw generic errors', async () => {
      jest.spyOn(organizersRepository, 'delete').mockImplementation(() => {
        throw new Error('generic error');
      });
      try {
        await service.deleteOrganizer(id);
      } catch (err) {
        expect(err.message).toContain('generic error');
      }
    });
  });
});

const organizersDataMock: Organizer[] = [
  new OrganizerMock(1),
  new OrganizerMock(2),
];
