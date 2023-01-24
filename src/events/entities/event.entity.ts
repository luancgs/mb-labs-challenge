import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Organizer } from '../../organizers/entities/organizer.entity';
import { Admin } from '../../admins/entities/admin.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  @ApiPropertyOptional()
  id: number;

  @Column({ length: 300 })
  @ApiProperty()
  title: string;

  @Column({ length: 300 })
  @ApiProperty()
  address: string;

  @Column('timestamp')
  @ApiProperty()
  date: Date;

  @Column({ length: 30, nullable: true })
  @ApiProperty()
  contactEmail: string;

  @Column({ length: 15, nullable: true })
  @ApiProperty()
  contactPhone: string;

  @Column({ unsigned: true })
  @ApiProperty()
  availableTickets: number;

  @Column('decimal', { precision: 6, scale: 2 })
  @ApiProperty()
  price: number;

  @Column('timestamp')
  @ApiPropertyOptional()
  createdAt: Date;

  @OneToOne(() => Organizer, { eager: true })
  @JoinColumn()
  @ApiProperty()
  organizer: Organizer;

  @OneToOne(() => Admin, { eager: true })
  @JoinColumn()
  @ApiProperty()
  admin: Admin;
}
