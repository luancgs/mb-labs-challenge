import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { Admin } from '../../admins/entities/admin.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  @ApiPropertyOptional()
  id: number;

  @Column({ length: 10 })
  @ApiProperty()
  code: string;

  @Column('tinyint', { unsigned: true })
  @ApiProperty()
  value: number;

  @OneToOne(() => Event, { eager: true })
  @JoinColumn()
  @ApiProperty()
  event: Event;

  @OneToOne(() => Admin, { eager: true })
  @JoinColumn()
  @ApiProperty()
  admin: Admin;
}
