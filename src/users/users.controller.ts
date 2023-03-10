import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from '../auth/admin/admin.jwt.auth.guard';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserCreateError } from './errors/user.create.error';
import { UserUpdateError } from './errors/user.update.error';
import { UserDeleteError } from './errors/user.delete.error';
import { Cart } from '../carts/entities/cart.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}
  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: User })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  @UseGuards(AdminJwtAuthGuard)
  async getAll() {
    try {
      return await this.service.getUsers();
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: User })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  @UseGuards(JwtAuthGuard)
  async get(@Param('id') id: number) {
    try {
      return await this.service.getUser(id);
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Body Error' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  async create(@Body() user: User) {
    try {
      await this.service.createUser(user);
      return 'user created successfully';
    } catch (error) {
      if (error instanceof UserCreateError) {
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
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Body Error' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() user: Partial<User>) {
    try {
      await this.service.updateUser(id, user);
      return 'user updated successfully';
    } catch (error) {
      if (error instanceof UserUpdateError) {
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
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid id',
  })
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number) {
    try {
      await this.service.deleteUser(id);
      return 'user deleted successfully';
    } catch (error) {
      if (error instanceof UserDeleteError) {
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

  @Get(':id/cart')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Cart })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  @UseGuards(JwtAuthGuard)
  async getUserCart(@Param('id') id: number) {
    try {
      return await this.service.getUserCart(id);
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/cart')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  @UseGuards(JwtAuthGuard)
  async updateUserCart(@Body() cart: Partial<Cart>) {
    try {
      return await this.service.updateUserCart(cart);
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/tickets')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Ticket })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  @UseGuards(JwtAuthGuard)
  async getUserTickets(@Param('id') id: number) {
    try {
      return await this.service.getUserTickets(id);
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/buy')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid payment method',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  @UseGuards(JwtAuthGuard)
  async buyUserCart(
    @Param('id') id: number,
    @Headers() headers,
    @Body() paymentMethodData,
  ) {
    try {
      const paymentMethod = headers['payment-method'];
      if (paymentMethod) {
        return await this.service.buyCart(id, paymentMethod, paymentMethodData);
      } else {
        throw new HttpException(
          `Error: invalid payment method`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
