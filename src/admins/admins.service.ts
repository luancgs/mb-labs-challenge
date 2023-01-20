import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,
  ) {}

  async getAdmins(): Promise<Admin[]> {
    return await this.adminsRepository.find();
  }

  async getAdmin(_id: number): Promise<Admin[]> {
    return await this.adminsRepository.find({
      where: [{ id: _id }],
    });
  }

  async createAdmin(admin: Admin) {
    this.adminsRepository.insert(admin);
  }

  async updateAdmin(id: number, admin: Partial<Admin>) {
    this.adminsRepository.update(id, admin);
  }

  async deleteAdmin(id: number) {
    this.adminsRepository.delete(id);
  }
}
