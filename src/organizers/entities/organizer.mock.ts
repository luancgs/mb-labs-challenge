import { AdminMock } from 'src/admins/entities/admin.mock';
import { Organizer } from './organizer.entity';

export class OrganizerMock extends Organizer {
  constructor(id: number) {
    super();
    this.id = id;
    this.name = 'mockOrganizerName';
    this.createdAt = new Date();
    this.admin = new AdminMock(1);
  }
}
