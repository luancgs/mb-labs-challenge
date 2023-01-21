import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';
import { Discount } from '../discounts/discount.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column('timestamp')
  boughtAt: Date;

  @OneToOne(() => Event, { eager: true })
  @JoinColumn()
  event: Event;

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  @OneToOne(() => Discount, { eager: true, nullable: true })
  @JoinColumn()
  discount: Discount;
}
