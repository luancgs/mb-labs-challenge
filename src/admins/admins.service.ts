import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { AdminCreateError } from './errors/admin.create.error';
import { AdminUpdateError } from './errors/admin.update.error';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,
  ) {}

  async getAdmins(): Promise<Admin[]> {
    try {
      return await this.adminsRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async getAdmin(_id: number): Promise<Admin[]> {
    try {
      return await this.adminsRepository.find({
        where: [{ id: _id }],
      });
    } catch (error) {
      throw error;
    }
  }

  async createAdmin(admin: Admin) {
    try {
      await this.adminsRepository.insert(admin);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new AdminCreateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async updateAdmin(id: number, admin: Partial<Admin>) {
    try {
      await this.adminsRepository.update(id, admin);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new AdminUpdateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async deleteAdmin(id: number) {
    try {
      return await this.adminsRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
