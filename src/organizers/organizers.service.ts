import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Organizer } from './organizer.entity';
import { OrganizerCreateError } from './errors/organizer.create.error';
import { OrganizerUpdateError } from './errors/organizer.update.error';

@Injectable()
export class OrganizersService {
  constructor(
    @InjectRepository(Organizer)
    private organizersRepository: Repository<Organizer>,
  ) {}

  async getOrganizers(): Promise<Organizer[]> {
    try {
      return await this.organizersRepository.find({ loadRelationIds: true });
    } catch (error) {
      throw error;
    }
  }

  async getOrganizer(_id: number): Promise<Organizer[]> {
    try {
      return await this.organizersRepository.find({
        where: [{ id: _id }],
        loadRelationIds: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async createOrganizer(organizer: Organizer) {
    try {
      await this.organizersRepository.insert(organizer);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new OrganizerCreateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async updateOrganizer(id: number, organizer: Partial<Organizer>) {
    try {
      await this.organizersRepository.update(id, organizer);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new OrganizerUpdateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async deleteOrganizer(id: number) {
    try {
      return await this.organizersRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
