import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizerGetDto } from './DTOs/organizer.get.dto';
import { Organizer } from './entities/organizer.entity';
import { OrganizerMock } from './entities/organizer.mock';
import { OrganizerCreateError } from './errors/organizer.create.error';
import { OrganizerDeleteError } from './errors/organizer.delete.error';
import { OrganizerUpdateError } from './errors/organizer.update.error';
import { OrganizersController } from './organizers.controller';
import { OrganizersService } from './organizers.service';

describe('OrganizersController', () => {
  let controller: OrganizersController;
  let service: OrganizersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizersController],
      providers: [
        {
          provide: OrganizersService,
          useFactory: () => ({
            getOrganizers: jest.fn(() => Promise.resolve(organizersDataMock)),
            getOrganizer: jest.fn(() => Promise.resolve(organizersDataMock[0])),
            createOrganizer: jest.fn(() => Promise.resolve(null)),
            updateOrganizer: jest.fn(() => Promise.resolve(null)),
            deleteOrganizer: jest.fn(() => Promise.resolve(null)),
          }),
        },
      ],
    }).compile();

    controller = module.get<OrganizersController>(OrganizersController);
    service = module.get<OrganizersService>(OrganizersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('GET /organizers', () => {
    it('should be defined', () => {
      expect(controller.getAll).toBeDefined();
    });

    it('should return OrganizerGetDto objects', async () => {
      const result = await controller.getAll();
      expect(result[0]).toMatchObject(organizersDataMock[0]);
      expect(result[0]).toBeInstanceOf(OrganizerGetDto);
    });

    it('should get all organizers', async () => {
      const result = await controller.getAll();
      expect(result.length).toBe(organizersDataMock.length);
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'getOrganizers').mockImplementationOnce(() => {
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

  describe('GET /organizers/:id', () => {
    const organizerId = 1;
    it('should be defined', () => {
      expect(controller.get).toBeDefined();
    });

    it('should return OrganizerGetDto object', async () => {
      const result = await controller.get(organizerId);
      expect(result).toMatchObject(organizersDataMock[0]);
      expect(result).toBeInstanceOf(OrganizerGetDto);
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'getOrganizer').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.get(organizerId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('POST /organizers', () => {
    const newOrganizer: Organizer = new OrganizerMock(3);
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.create(newOrganizer);
      expect(result).toEqual('organizer created successfully');
    });

    it('should create 1 organizer', async () => {
      await controller.create(newOrganizer);
      const createOrganizer = jest.spyOn(service, 'createOrganizer');
      expect(createOrganizer).toBeCalledTimes(1);
    });

    it('should throw Bad Request Error when error in body', async () => {
      jest.spyOn(service, 'createOrganizer').mockImplementationOnce(() => {
        throw new OrganizerCreateError('body error');
      });
      try {
        await controller.create(newOrganizer);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(400);
        expect(err.message).toContain('body error');
      }
    });

    it('should throw Internal Server Error when error ', async () => {
      jest.spyOn(service, 'createOrganizer').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.create(newOrganizer);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('PUT /organizers/:id', () => {
    const id = 3;
    const partialOrganizer: Partial<Organizer> = {
      name: 'Ashley Jonas',
    };
    it('should be defined', () => {
      expect(controller.update).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.update(id, partialOrganizer);
      expect(result).toEqual('organizer updated successfully');
    });

    it('should update 1 organizer', async () => {
      await controller.update(id, partialOrganizer);
      const updateOrganizer = jest.spyOn(service, 'updateOrganizer');
      expect(updateOrganizer).toBeCalledTimes(1);
    });

    it('should throw Bad Request Error when error in body', async () => {
      jest.spyOn(service, 'updateOrganizer').mockImplementationOnce(() => {
        throw new OrganizerUpdateError('body error');
      });
      try {
        await controller.update(id, partialOrganizer);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(400);
        expect(err.message).toContain('body error');
      }
    });

    it('should throw Internal Server Error when generic error ', async () => {
      jest.spyOn(service, 'updateOrganizer').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.update(id, partialOrganizer);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });

  describe('DELETE /organizers/:id', () => {
    const organizerId = 3;
    it('should be defined', () => {
      expect(controller.delete).toBeDefined();
    });

    it('should return success message', async () => {
      const result = await controller.delete(organizerId);
      expect(result).toEqual('organizer deleted successfully');
    });

    it('should delete 1 organizer', async () => {
      await controller.delete(organizerId);
      const deleteOrganizer = jest.spyOn(service, 'deleteOrganizer');
      expect(deleteOrganizer).toBeCalledTimes(1);
    });

    it('should throw Unprocessable Entity Error when id not found', async () => {
      jest.spyOn(service, 'deleteOrganizer').mockImplementationOnce(() => {
        throw new OrganizerDeleteError('id error');
      });
      try {
        await controller.delete(organizerId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(422);
        expect(err.message).toContain('id error');
      }
    });

    it('should throw Internal Server Error when generic error ', async () => {
      jest.spyOn(service, 'deleteOrganizer').mockImplementationOnce(() => {
        throw new Error('service error');
      });
      try {
        await controller.delete(organizerId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(500);
        expect(err.message).toContain('service error');
      }
    });
  });
});

const organizersDataMock: OrganizerGetDto[] = [
  new OrganizerMock(1).controller(),
  new OrganizerMock(2).controller(),
];
