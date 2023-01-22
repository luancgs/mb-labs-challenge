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
  Query,
} from '@nestjs/common';
import { Organizer } from './organizer.entity';
import { OrganizersService } from './organizers.service';
import { OrganizerCreateError } from './errors/organizer.create.error';
import { OrganizerUpdateError } from './errors/organizer.update.error';
import { AdminJwtAuthGuard } from '../auth/admin/admin.jwt.auth.guard';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('organizers')
export class OrganizersController {
  constructor(private service: OrganizersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Query('name') name?: string) {
    try {
      return await this.service.getOrganizers(name);
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async get(@Param('id') id: number) {
    try {
      return await this.service.getOrganizer(id);
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  async create(@Body() organizer: Organizer) {
    try {
      await this.service.createOrganizer(organizer);
      return 'organizer created successfully';
    } catch (error) {
      if (error instanceof OrganizerCreateError) {
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
  @UseGuards(AdminJwtAuthGuard)
  async update(@Param('id') id: number, @Body() organizer: Partial<Organizer>) {
    try {
      await this.service.updateOrganizer(id, organizer);
      return 'organizer updated successfully';
    } catch (error) {
      if (error instanceof OrganizerUpdateError) {
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
  @UseGuards(AdminJwtAuthGuard)
  async delete(@Param('id') id: number) {
    try {
      await this.service.deleteOrganizer(id);
      return 'organizer deleted successfully';
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
