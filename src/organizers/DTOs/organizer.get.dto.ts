import { Organizer } from '../entities/organizer.entity';

export class OrganizerGetDto {
  id: number;
  name: string;
  constructor(organizer: Organizer) {
    this.id = organizer.id;
    this.name = organizer.name;
  }
}
