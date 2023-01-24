import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { User } from '../../users/entities/user.entity';
import { Discount } from '../../discounts/entities/discount.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  @ApiPropertyOptional()
  id: number;

  @Column({ unsigned: true })
  @ApiProperty()
  quantity: number;

  @OneToOne(() => Event, { eager: true })
  @JoinColumn()
  @ApiProperty()
  event: Event;

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  @ApiProperty()
  user: User;

  @OneToOne(() => Discount, { eager: true, nullable: true })
  @JoinColumn()
  @ApiProperty()
  discount: Discount;
}
