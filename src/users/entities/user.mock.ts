import { User } from './user.entity';

export class UserMock extends User {
  constructor(id: number) {
    super();
    this.id = id;
    this.name = 'mockUserName';
    this.email = 'mockUserEmail';
    this.password =
      '$2b$10$qsmPDn0vKxCuhpQXSHqxyeXq4ZXAoYyEaUWlgqCvbYgFBiNBqomAq';
    this.createdAt = new Date();
  }
}
