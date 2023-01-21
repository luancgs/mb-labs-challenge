import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Admin } from '../admins/admin.entity';

@Entity()
export class Organizer {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column('timestamp')
  createdAt: Date;

  @OneToOne(() => Admin, { eager: true })
  @JoinColumn()
  admin: Admin;
}
