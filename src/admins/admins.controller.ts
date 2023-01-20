import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { Admin } from './admin.entity';
import { AdminsService } from './admins.service';

@Controller('admins')
export class AdminsController {
  constructor(private service: AdminsService) {}

  @Get()
  getAll() {
    return this.service.getAdmins();
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.service.getAdmin(id);
  }

  @Post()
  create(@Body() admin: Admin) {
    return this.service.createAdmin(admin);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() admin: Partial<Admin>) {
    return this.service.updateAdmin(id, admin);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.deleteAdmin(id);
  }
}
