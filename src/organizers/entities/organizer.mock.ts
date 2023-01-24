import { AdminMock } from '../../admins/entities/admin.mock';
import { OrganizerGetDto } from '../DTOs/organizer.get.dto';
import { Organizer } from './organizer.entity';

export class OrganizerMock extends Organizer {
  constructor(id: number) {
    super();
    this.id = id;
    this.name = 'mockOrganizerName';
    this.createdAt = new Date();
    this.admin = new AdminMock(1);
  }

  controller(): OrganizerGetDto {
    return new OrganizerGetDto(this);
  }

  service() {
    return this;
  }
}
