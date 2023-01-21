import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { Discount } from './discount.entity';
import { DiscountsService } from './discounts.service';

@Controller('discounts')
export class DiscountsController {
  constructor(private service: DiscountsService) {}

  @Get()
  getAll() {
    return this.service.getDiscounts();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.service.getDiscountById(id);
  }

  @Post()
  create(@Body() discount: Discount) {
    return this.service.createDiscount(discount);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() discount: Partial<Discount>) {
    return this.service.updateDiscount(id, discount);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.deleteDiscount(id);
  }
}
