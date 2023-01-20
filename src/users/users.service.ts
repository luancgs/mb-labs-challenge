import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUser(_id: number): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ id: _id }],
    });
  }

  async createUser(user: User) {
    this.usersRepository.insert(user);
  }

  async updateUser(id: number, user: Partial<User>) {
    this.usersRepository.update(id, user);
  }

  async deleteUser(id: number) {
    this.usersRepository.delete(id);
  }
}
