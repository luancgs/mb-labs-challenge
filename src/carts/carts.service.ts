import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartGetDto } from './DTOs/cart.get.dto';
import { CartDeleteError } from './errors/cart.delete.error';
import { CartUpdateError } from './errors/cart.update.error';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
  ) {}

  async getCartByUserId(_id: number): Promise<CartGetDto[]> {
    try {
      const carts = await this.cartsRepository.find({
        where: { user: { id: _id } },
      });

      const output: CartGetDto[] = [];
      for (const cart of carts) {
        output.push(new CartGetDto(cart));
      }
      return output;
    } catch (error) {
      throw error;
    }
  }

  async updateCartById(_id: number, cart: Partial<Cart>) {
    try {
      cart.id = _id;
      await this.cartsRepository.save(cart);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new CartUpdateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async deleteCartByUserId(_id: number) {
    try {
      await this.cartsRepository.delete({
        user: { id: _id },
      });
    } catch (error) {
      throw new CartDeleteError(error.message);
    }
  }
}
