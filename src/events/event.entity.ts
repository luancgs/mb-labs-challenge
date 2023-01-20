import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Admin } from '../admins/admin.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number;

  @Column({ length: 300 })
  title: string;

  @Column({ length: 300 })
  address: string;

  @Column('timestamp')
  date: Date;

  @Column({ length: 30, nullable: true })
  contactEmail: string;

  @Column({ length: 15, nullable: true })
  contactPhone: string;

  @Column({ unsigned: true })
  availableTickets: number;

  @Column('decimal', { precision: 6, scale: 2 })
  price: number;

  @OneToOne(() => Admin, { eager: true })
  @JoinColumn()
  admin: Admin;

  @Column('timestamp')
  createdAt: Date;
}
