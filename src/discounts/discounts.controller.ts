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
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from '../auth/admin/admin.jwt.auth.guard';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Discount } from './entities/discount.entity';
import { DiscountsService } from './discounts.service';
import { DiscountCreateError } from './errors/discount.create.error';
import { DiscountDeleteError } from './errors/discount.delete.error';
import { DiscountUpdateError } from './errors/discount.update.error';
import { ApiTags } from '@nestjs/swagger';

@Controller('discounts')
@ApiTags('discounts')
export class DiscountsController {
  constructor(private service: DiscountsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Query('code') code?: string) {
    try {
      return await this.service.getDiscounts(code);
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: number) {
    try {
      return await this.service.getDiscountById(id);
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  async create(@Body() discount: Discount) {
    try {
      await this.service.createDiscount(discount);
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

  @Put(':id')
  @UseGuards(AdminJwtAuthGuard)
  async update(@Param('id') id: number, @Body() discount: Partial<Discount>) {
    try {
      await this.service.updateDiscount(id, discount);
      return 'discount updated successfully';
    } catch (error) {
      if (error instanceof DiscountUpdateError) {
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
      await this.service.deleteDiscount(id);
      return 'discount deleted successfully';
    } catch (error) {
      if (error instanceof DiscountDeleteError) {
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
