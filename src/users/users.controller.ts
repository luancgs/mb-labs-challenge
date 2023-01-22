import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserCreateError } from './errors/user.create.error';
import { UserUpdateError } from './errors/user.update.error';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}
  @Get()
  async getAll() {
    try {
      return await this.service.getUsers();
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    try {
      return await this.service.getUserById(id);
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() user: User) {
    try {
      await this.service.createUser(user);
      return 'user created successfully';
    } catch (error) {
      if (error instanceof UserCreateError) {
        throw new HttpException(
          `Bad Request: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          `Error: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() user: Partial<User>) {
    try {
      await this.service.updateUser(id, user);
      return 'user updated successfully';
    } catch (error) {
      if (error instanceof UserUpdateError) {
        throw new HttpException(
          `Bad Request: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          `Error: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      await this.service.deleteUser(id);
      return 'user deleted successfully';
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
