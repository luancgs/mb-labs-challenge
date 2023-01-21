import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount } from './discount.entity';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private discountsRepository: Repository<Discount>,
  ) {}

  async getDiscounts(): Promise<Discount[]> {
    return await this.discountsRepository.find({ loadRelationIds: true });
  }

  async getDiscountById(_id: number): Promise<Discount[]> {
    return await this.discountsRepository.find({
      where: [{ id: _id }],
      loadRelationIds: true,
    });
  }

  async createDiscount(discount: Discount) {
    this.discountsRepository.insert(discount);
  }

  async updateDiscount(id: number, discount: Partial<Discount>) {
    this.discountsRepository.update(id, discount);
  }

  async deleteDiscount(id: number) {
    this.discountsRepository.delete(id);
  }
}
