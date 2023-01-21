import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartsService } from './carts.service';

@Controller('carts')
export class CartsController {
  constructor(private service: CartsService) {}

  @Get()
  getAll() {
    return this.service.getCarts();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.service.getCartById(id);
  }

  @Post()
  create(@Body() cart: Cart) {
    return this.service.createCart(cart);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() cart: Partial<Cart>) {
    return this.service.updateCart(id, cart);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.deleteCart(id);
  }
}