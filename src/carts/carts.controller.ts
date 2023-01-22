import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from 'src/auth/admin/admin.jwt.auth.guard';
import { Cart } from './cart.entity';
import { CartsService } from './carts.service';
import { CartCreateError } from './errors/cart.create.error';
import { CartDeleteError } from './errors/cart.delete.error';
import { CartUpdateError } from './errors/cart.update.error';

@Controller('carts')
@UseGuards(AdminJwtAuthGuard)
export class CartsController {
  constructor(private service: CartsService) {}

  @Get()
  async getAll() {
    try {
      return await this.service.getCarts();
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getByUserId(@Param('id') id: number) {
    try {
      return await this.service.getCartByUserId(id);
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() cart: Cart) {
    try {
      await this.service.createCart(cart);
      return 'cart created successfully';
    } catch (error) {
      if (error instanceof CartCreateError) {
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
  async update(@Param('id') id: number, @Body() cart: Partial<Cart>) {
    try {
      await this.service.updateCart(id, cart);
      return 'cart updated successfully';
    } catch (error) {
      if (error instanceof CartUpdateError) {
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
      await this.service.deleteCart(id);
      return 'cart deleted successfully';
    } catch (error) {
      if (error instanceof CartDeleteError) {
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
