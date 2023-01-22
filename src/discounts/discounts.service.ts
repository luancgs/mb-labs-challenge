import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityPropertyNotFoundError,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { Discount } from './discount.entity';
import { DiscountGetDto } from './DTOs/discount.get.dto';
import { DiscountCreateError } from './errors/discount.create.error';
import { DiscountDeleteError } from './errors/discount.delete.error';
import { DiscountUpdateError } from './errors/discount.update.error';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private discountsRepository: Repository<Discount>,
  ) {}

  async getDiscounts(_code: string): Promise<DiscountGetDto[]> {
    try {
      let discounts: Discount[];

      if (_code !== undefined) {
        discounts = await this.discountsRepository.find({
          where: { code: _code },
        });
      } else {
        discounts = await this.discountsRepository.find();
      }

      const output: DiscountGetDto[] = [];
      for (const discount of discounts) {
        output.push(new DiscountGetDto(discount));
      }

      return output;
    } catch (error) {
      throw error;
    }
  }

  async getDiscountById(_id: number): Promise<DiscountGetDto> {
    try {
      const discount = await this.discountsRepository.findOne({
        where: { id: _id },
      });
      if (discount) {
        return new DiscountGetDto(discount);
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  async getDiscountByEvent(_id: number): Promise<DiscountGetDto[]> {
    try {
      const discounts = await this.discountsRepository.find({
        where: { event: { id: _id } },
      });

      const output: DiscountGetDto[] = [];
      for (const discount of discounts) {
        output.push(new DiscountGetDto(discount));
      }

      return output;
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
