import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityPropertyNotFoundError,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { TicketCreateError } from './errors/ticket.create.error';
import { TicketUpdateError } from './errors/ticket.update.error';
import { Ticket } from './ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  async getTickets(): Promise<Ticket[]> {
    try {
      return await this.ticketsRepository.find({ loadRelationIds: true });
    } catch (error) {
      throw error;
    }
  }

  async getTicketById(_id: number): Promise<Ticket[]> {
    try {
      return await this.ticketsRepository.find({
        where: [{ id: _id }],
        loadRelationIds: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async createTicket(ticket: Ticket) {
    try {
      await this.ticketsRepository.insert(ticket);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new TicketCreateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async updateTicket(id: number, ticket: Partial<Ticket>) {
    try {
      await this.ticketsRepository.update(id, ticket);
    } catch (error) {
      if (
        error instanceof QueryFailedError ||
        error instanceof EntityPropertyNotFoundError
      ) {
        throw new TicketUpdateError(error.message);
      } else {
        throw error;
      }
    }
  }

  async deleteTicket(id: number) {
    try {
      await this.ticketsRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
