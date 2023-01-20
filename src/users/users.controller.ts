import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get()
  getAll() {
    return this.service.getUsers();
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.service.getUser(id);
  }

  @Post()
  create(@Body() user: User) {
    return this.service.createUser(user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() user: Partial<User>) {
    return this.service.updateUser(id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.deleteUser(id);
  }
}
