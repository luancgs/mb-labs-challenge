import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityPropertyNotFoundError,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { UserCreateError } from './errors/user.create.error';
import { UserUpdateError } from './errors/user.update.error';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async getUser(_id: number): Promise<User[]> {
    try {
      return await this.usersRepository.find({
        where: [{ id: _id }],
      });
    } catch (error) {
      throw error;
    }
  }

  async createUser(user: User) {
    try {
      await this.usersRepository.insert(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new UserCreateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async updateUser(id: number, user: Partial<User>) {
    try {
      await this.usersRepository.update(id, user);
    } catch (error) {
      console.log(error);
      if (
        error instanceof QueryFailedError ||
        error instanceof EntityPropertyNotFoundError
      ) {
        throw new UserUpdateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async deleteUser(id: number) {
    try {
      return await this.usersRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
