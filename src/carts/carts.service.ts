import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
  ) {}

  async getCarts(): Promise<Cart[]> {
    return await this.cartsRepository.find({ loadRelationIds: true });
  }

  async getCartById(_id: number): Promise<Cart[]> {
    return await this.cartsRepository.find({
      where: [{ id: _id }],
      loadRelationIds: true,
    });
  }

  async createCart(cart: Cart) {
    this.cartsRepository.insert(cart);
  }

  async updateCart(id: number, cart: Partial<Cart>) {
    this.cartsRepository.update(id, cart);
  }

  async deleteCart(id: number) {
    this.cartsRepository.delete(id);
  }
}
