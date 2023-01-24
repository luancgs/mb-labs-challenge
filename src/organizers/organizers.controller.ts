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
import { AdminJwtAuthGuard } from '../auth/admin/admin.jwt.auth.guard';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Organizer } from './entities/organizer.entity';
import { OrganizersService } from './organizers.service';
import { OrganizerCreateError } from './errors/organizer.create.error';
import { OrganizerUpdateError } from './errors/organizer.update.error';
import { OrganizerDeleteError } from './errors/organizer.delete.error';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('organizers')
@Controller('organizers')
export class OrganizersController {
  constructor(private service: OrganizersService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: Organizer,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: Organizer,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
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
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Body Error' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
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
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Body Error' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
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
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid id',
  })
  @UseGuards(AdminJwtAuthGuard)
  async delete(@Param('id') id: number) {
    try {
      await this.service.deleteOrganizer(id);
      return 'organizer deleted successfully';
    } catch (error) {
      if (error instanceof OrganizerDeleteError) {
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
