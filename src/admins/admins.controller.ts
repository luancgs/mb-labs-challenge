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
  UseGuards,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from '../auth/admin/admin.jwt.auth.guard';
import { Admin } from './entities/admin.entity';
import { AdminsService } from './admins.service';
import { AdminCreateError } from './errors/admin.create.error';
import { AdminDeleteError } from './errors/admin.delete.error';
import { AdminUpdateError } from './errors/admin.update.error';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('admins')
@Controller('admins')
@UseGuards(AdminJwtAuthGuard)
export class AdminsController {
  constructor(private service: AdminsService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Admin })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  async getAll() {
    try {
      return await this.service.getAdmins();
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Admin })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  async get(@Param('id') id: number) {
    try {
      return await this.service.getAdmin(id);
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Body Error' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  async create(@Body() admin: Admin) {
    try {
      await this.service.createAdmin(admin);
      return 'admin created successfully';
    } catch (error) {
      if (error instanceof AdminCreateError) {
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
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Body Error' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  async update(@Param('id') id: number, @Body() admin: Partial<Admin>) {
    try {
      await this.service.updateAdmin(id, admin);
      return 'admin updated successfully';
    } catch (error) {
      if (error instanceof AdminUpdateError) {
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
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid id',
  })
  async delete(@Param('id') id: number) {
    try {
      await this.service.deleteAdmin(id);
      return 'admin deleted successfully';
    } catch (error) {
      if (error instanceof AdminDeleteError) {
        throw new HttpException(
          `Failed Request: ${error.message}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      } else {
        throw new HttpException(
          `Error: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
