import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityPropertyNotFoundError,
  FindManyOptions,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { Discount } from './discount.entity';
import { DiscountCreateError } from './errors/discount.create.error';
import { DiscountDeleteError } from './errors/discount.delete.error';
import { DiscountUpdateError } from './errors/discount.update.error';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private discountsRepository: Repository<Discount>,
  ) {}

  async getDiscounts(_code: string): Promise<Discount[]> {
    try {
      let queryOptions: FindManyOptions;
      if (_code === undefined) {
        queryOptions = { loadRelationIds: true };
      } else {
        queryOptions = { where: [{ code: _code }], loadRelationIds: true };
      }
      return await this.discountsRepository.find(queryOptions);
    } catch (error) {
      throw error;
    }
  }

  async getDiscountById(_id: number): Promise<Discount[]> {
    try {
      return await this.discountsRepository.find({
        where: [{ id: _id }],
        loadRelationIds: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async createDiscount(discount: Discount) {
    try {
      await this.discountsRepository.insert(discount);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new DiscountCreateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async updateDiscount(id: number, discount: Partial<Discount>) {
    try {
      await this.discountsRepository.update(id, discount);
    } catch (error) {
      if (
        error instanceof QueryFailedError ||
        error instanceof EntityPropertyNotFoundError
      ) {
        throw new DiscountUpdateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async deleteDiscount(id: number) {
    try {
      const deleteResult = await this.discountsRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new DiscountDeleteError('discount id not found');
      }
    } catch (error) {
      throw error;
    }
  }
}
