import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from '../auth/admin/admin.jwt.auth.guard';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Discount } from '../discounts/entities/discount.entity';
import { DiscountCreateError } from '../discounts/errors/discount.create.error';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';
import { EventCreateError } from './errors/event.create.error';
import { EventDeleteError } from './errors/event.delete.error';
import { EventUpdateError } from './errors/event.update.error';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private service: EventsService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Event })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Query('title') title?: string,
    @Query('organizer') organizer?: string,
    @Query('address') address?: string,
    @Query('availableOnly') availableOnly?: string,
  ) {
    try {
      return await this.service.getEvents(
        title,
        organizer,
        address,
        availableOnly,
      );
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Event })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  @UseGuards(JwtAuthGuard)
  async get(@Param('id') id: number) {
    try {
      return await this.service.getEvent(id);
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/discounts')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: Discount,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  @UseGuards(JwtAuthGuard)
  async getEventDiscounts(@Param('id') id: number) {
    try {
      return await this.service.getEventDiscounts(id);
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/discounts')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Body Error' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  @UseGuards(AdminJwtAuthGuard)
  async createEventDiscount(
    @Param('id') id: number,
    @Body() discount: Discount,
  ) {
    try {
      await this.service.createEventDiscount(id, discount);
      return 'discount created successfully';
    } catch (error) {
      if (error instanceof DiscountCreateError) {
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

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Body Error' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Forbidden' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  @UseGuards(AdminJwtAuthGuard)
  async create(@Body() event: Event) {
    try {
      await this.service.createEvent(event);
      return 'event created successfully';
    } catch (error) {
      if (error instanceof EventCreateError) {
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
  async update(@Param('id') id: number, @Body() event: Partial<Event>) {
    try {
      await this.service.updateEvent(id, event);
      return 'event updated successfully';
    } catch (error) {
      if (error instanceof EventUpdateError) {
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
      await this.service.deleteEvent(id);
      return 'event deleted successfully';
    } catch (error) {
      if (error instanceof EventDeleteError) {
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
