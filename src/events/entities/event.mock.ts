import { AdminMock } from '../../admins/entities/admin.mock';
import { OrganizerMock } from '../../organizers/entities/organizer.mock';
import { EventGetDto } from '../DTOs/event.get.dto';
import { Event } from './event.entity';

export class EventMock extends Event {
  constructor(id: number) {
    super();
    this.id = id;
    this.title = 'mockEventTitle';
    this.address = 'mockEventAddress';
    this.date = new Date();
    this.contactEmail = 'mockContactEmail';
    this.contactPhone = 'mockContactPhone';
    this.availableTickets = 20;
    this.price = 1.99;
    this.createdAt = new Date();
    this.organizer = new OrganizerMock(1);
    this.admin = new AdminMock(1);
  }

  controller(): EventGetDto {
    return new EventGetDto(this);
  }

  service() {
    return this;
  }
}
