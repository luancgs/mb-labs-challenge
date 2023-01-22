import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { AdminCreateError } from './errors/admin.create.error';
import { AdminUpdateError } from './errors/admin.update.error';
import { AdminDeleteError } from './errors/admin.delete.error';
import * as bcrypt from 'bcrypt';

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

  async getAdminLogin(_email: string): Promise<Admin> {
    try {
      return await this.adminsRepository
        .createQueryBuilder('admin')
        .where('admin.email = :email', { email: _email })
        .addSelect('admin.password')
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async createAdmin(admin: Admin) {
    try {
      const passwordHash = await bcrypt.hash(admin.password, 10);
      admin.password = passwordHash;
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
      if (admin.password) {
        const passwordHash = await bcrypt.hash(admin.password, 10);
        admin.password = passwordHash;
      }
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
      const deleteResult = await this.adminsRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new AdminDeleteError('admin id not found');
      }
    } catch (error) {
      throw error;
    }
  }
}
