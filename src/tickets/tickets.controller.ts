import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { Ticket } from './ticket.entity';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private service: TicketsService) {}

  @Get()
  getAll() {
    return this.service.getTickets();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.service.getTicketById(id);
  }

  @Post()
  create(@Body() ticket: Ticket) {
    return this.service.createTicket(ticket);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() ticket: Partial<Ticket>) {
    return this.service.updateTicket(id, ticket);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.deleteTicket(id);
  }
}
