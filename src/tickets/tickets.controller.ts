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
} from '@nestjs/common';
import { TicketCreateError } from './errors/ticket.create.error';
import { TicketUpdateError } from './errors/ticket.update.error';
import { Ticket } from './ticket.entity';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private service: TicketsService) {}

  @Get()
  async getAll() {
    try {
      return await this.service.getTickets();
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    try {
      return await this.service.getTicketById(id);
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() ticket: Ticket) {
    try {
      await this.service.createTicket(ticket);
      return 'ticket created successfully';
    } catch (error) {
      if (error instanceof TicketCreateError) {
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
  async update(@Param('id') id: number, @Body() ticket: Partial<Ticket>) {
    try {
      await this.service.updateTicket(id, ticket);
      return 'ticket updated successfully';
    } catch (error) {
      if (error instanceof TicketUpdateError) {
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
  async delete(@Param('id') id: number) {
    try {
      await this.service.deleteTicket(id);
      return 'ticket deleted successfully';
    } catch (error) {
      throw new HttpException(
        `Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
