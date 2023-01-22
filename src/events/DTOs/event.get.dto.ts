import { Event } from '../event.entity';
import { OrganizerGetDto } from '../../organizers/DTOs/organizer.get.dto';

export class EventGetDto {
  id: number;
  title: string;
  address: string;
  date: Date;
  contact: EventContactInfo;
  availableTickets: number;
  price: number;
  organizer: OrganizerGetDto;
  constructor(event: Event) {
    this.id = event.id;
    this.title = event.title;
    this.address = event.address;
    this.date = event.date;
    this.availableTickets = event.availableTickets;
    this.price = event.price;
    this.contact = new EventContactInfo(event);
    this.organizer = new OrganizerGetDto(event.organizer);
  }
}

class EventContactInfo {
  email: string;
  phone: string;
  constructor(event: Event) {
    this.email = event.contactEmail;
    this.phone = event.contactPhone;
  }
}
