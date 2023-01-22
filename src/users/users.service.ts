import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityPropertyNotFoundError,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { UserCreateError } from './errors/user.create.error';
import { UserUpdateError } from './errors/user.update.error';
import { UserDeleteError } from './errors/user.delete.error';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

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

  async getUserById(_id: number): Promise<User[]> {
    try {
      return await this.usersRepository.find({
        where: [{ id: _id }],
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(_email: string): Promise<User> {
    try {
      return await this.usersRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email: _email })
        .addSelect('user.password')
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async createUser(user: User) {
    try {
      const passwordHash = await bcrypt.hash(user.password, 10);
      user.password = passwordHash;
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
      if (user.password) {
        const passwordHash = await bcrypt.hash(user.password, 10);
        user.password = passwordHash;
      }
      await this.usersRepository.update(id, user);
    } catch (error) {
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
      const deleteResult = await this.usersRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new UserDeleteError('user id not found');
      }
    } catch (error) {
      throw error;
    }
  }
}
