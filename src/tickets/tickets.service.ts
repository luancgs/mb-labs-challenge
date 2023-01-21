import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  async getTickets(): Promise<Ticket[]> {
    return await this.ticketsRepository.find({ loadRelationIds: true });
  }

  async getTicketById(_id: number): Promise<Ticket[]> {
    return await this.ticketsRepository.find({
      where: [{ id: _id }],
      loadRelationIds: true,
    });
  }

  async createTicket(ticket: Ticket) {
    this.ticketsRepository.insert(ticket);
  }

  async updateTicket(id: number, ticket: Partial<Ticket>) {
    this.ticketsRepository.update(id, ticket);
  }

  async deleteTicket(id: number) {
    this.ticketsRepository.delete(id);
  }
}
