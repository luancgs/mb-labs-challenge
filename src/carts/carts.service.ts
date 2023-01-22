import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartCreateError } from './errors/cart.create.error';
import { CartDeleteError } from './errors/cart.delete.error';
import { CartUpdateError } from './errors/cart.update.error';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
  ) {}

  async getCarts(): Promise<Cart[]> {
    try {
      return await this.cartsRepository.find({ loadRelationIds: true });
    } catch (error) {
      throw error;
    }
  }

  async getCartByUserId(_id: number): Promise<Cart[]> {
    try {
      return await this.cartsRepository.find({
        where: [{ user: { id: _id } }],
        loadRelationIds: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async createCart(cart: Cart) {
    try {
      await this.cartsRepository.insert(cart);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new CartCreateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async updateCart(id: number, cart: Partial<Cart>) {
    try {
      await this.cartsRepository.update(id, cart);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new CartUpdateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async deleteCart(id: number) {
    try {
      const deleteResult = await this.cartsRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new CartDeleteError('cart id not found');
      }
    } catch (error) {
      throw error;
    }
  }
}
