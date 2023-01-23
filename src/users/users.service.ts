import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityPropertyNotFoundError,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { UserCreateError } from './errors/user.create.error';
import { UserUpdateError } from './errors/user.update.error';
import { UserDeleteError } from './errors/user.delete.error';
import { UserCartError } from './errors/user.cart.error';
import { User } from './user.entity';
import { CartsService } from '../carts/carts.service';
import { PaymentService } from '../payment/payment.service';
import * as bcrypt from 'bcrypt';
import { Cart } from 'src/carts/cart.entity';
import { TicketsService } from 'src/tickets/tickets.service';
import { CartGetDto } from 'src/carts/DTOs/cart.get.dto';
import { TicketCreateError } from 'src/tickets/errors/ticket.create.error';
import { CartDeleteError } from 'src/carts/errors/cart.delete.error';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private cartsService: CartsService,
    private paymentService: PaymentService,
    private ticketsService: TicketsService,
    private eventsService: EventsService,
  ) {}

  async getUsers(): Promise<User[]> {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async getUser(_id: number): Promise<User[]> {
    try {
      return await this.usersRepository.find({
        where: [{ id: _id }],
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserLogin(_email: string): Promise<User> {
    try {
      return await this.usersRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email: _email })
        .addSelect('user.password')
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async createUser(user: User) {
    try {
      const passwordHash = await bcrypt.hash(user.password, 10);
      user.password = passwordHash;
      await this.usersRepository.insert(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new UserCreateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async updateUser(id: number, user: Partial<User>) {
    try {
      if (user.password) {
        const passwordHash = await bcrypt.hash(user.password, 10);
        user.password = passwordHash;
      }
      await this.usersRepository.update(id, user);
    } catch (error) {
      if (
        error instanceof QueryFailedError ||
        error instanceof EntityPropertyNotFoundError
      ) {
        throw new UserUpdateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async deleteUser(id: number) {
    try {
      const deleteResult = await this.usersRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new UserDeleteError('user id not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async getUserCart(id: number) {
    try {
      return await this.cartsService.getCartByUserId(id);
    } catch (error) {
      throw error;
    }
  }

  async updateUserCart(cart: Partial<Cart>) {
    try {
      return await this.cartsService.updateCartById(cart.id, cart);
    } catch (error) {
      throw error;
    }
  }

  async buyCart(id: number, paymentMethod: string, paymentMethodData: any) {
    try {
      const cart = await this.getUserCart(id);

      if (cart.length === 0)
        throw new UserCartError('cannot buy an empty cart');

      const value = this.paymentService.calculateCartValue(cart);

      await this.paymentService.executePayment(
        value,
        paymentMethod,
        paymentMethodData,
      );

      await this.afterBuy(id, cart);

      return 'payment successful';
    } catch (error) {
      throw error;
    }
  }

  async afterBuy(userId: number, cart: CartGetDto[]) {
    try {
      for (const item of cart) {
        for (let i = 0; i < item.quantity; i++) {
          await this.ticketsService.createTicketByCartItem(item);
        }
        await this.eventsService.reduceEventTickets(
          item.event.id,
          item.quantity,
        );
      }
    } catch (error) {
      throw new TicketCreateError(error.message);
    }

    try {
      //await this.cartsService.deleteCartByUserId(userId);
    } catch (error) {
      throw new CartDeleteError(error.message);
    }
  }
}
