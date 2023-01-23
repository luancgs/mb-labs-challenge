import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { Admin } from '../../admins/entities/admin.entity';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number;

  @Column({ length: 10 })
  code: string;

  @Column('tinyint', { unsigned: true })
  value: number;

  @OneToOne(() => Event, { eager: true })
  @JoinColumn()
  event: Event;

  @OneToOne(() => Admin, { eager: true })
  @JoinColumn()
  admin: Admin;
}
