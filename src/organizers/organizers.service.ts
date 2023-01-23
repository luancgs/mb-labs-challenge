import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, QueryFailedError, Repository } from 'typeorm';
import { Organizer } from './entities/organizer.entity';
import { OrganizerCreateError } from './errors/organizer.create.error';
import { OrganizerUpdateError } from './errors/organizer.update.error';
import { OrganizerDeleteError } from './errors/organizer.delete.error';
import { OrganizerGetDto } from './DTOs/organizer.get.dto';

@Injectable()
export class OrganizersService {
  constructor(
    @InjectRepository(Organizer)
    private organizersRepository: Repository<Organizer>,
  ) {}

  async getOrganizers(_name: string): Promise<OrganizerGetDto[]> {
    try {
      let organizers: Organizer[];

      if (_name !== undefined) {
        organizers = await this.organizersRepository.find({
          where: { name: Like(`%${_name}%`) },
        });
      } else {
        organizers = await this.organizersRepository.find();
      }

      const output: OrganizerGetDto[] = [];
      for (const organizer of organizers) {
        output.push(new OrganizerGetDto(organizer));
      }

      return output;
    } catch (error) {
      throw error;
    }
  }

  async getOrganizer(_id: number): Promise<OrganizerGetDto> {
    try {
      const organizer = await this.organizersRepository.findOne({
        where: { id: _id },
      });

      if (organizer) {
        return new OrganizerGetDto(organizer);
      } else {
        return null;
      }
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
      const deleteResult = await this.organizersRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new OrganizerDeleteError('organizer id not found');
      }
    } catch (error) {
      throw error;
    }
  }
}
