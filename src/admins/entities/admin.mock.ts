import { Admin } from './admin.entity';

export class AdminMock extends Admin {
  constructor(id: number) {
    super();
    this.id = id;
    this.name = 'mockAdminName';
    this.email = 'mockAdminEmail';
    this.password =
      '$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq';
    this.createdAt = new Date();
  }
}
