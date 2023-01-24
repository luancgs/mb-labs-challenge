import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Admin } from '../../admins/entities/admin.entity';

@Entity()
export class Organizer {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  @ApiPropertyOptional()
  id: number;

  @Column({ length: 200 })
  @ApiProperty()
  name: string;

  @Column('timestamp')
  @ApiPropertyOptional()
  createdAt: Date;

  @OneToOne(() => Admin, { eager: true })
  @JoinColumn()
  @ApiProperty()
  admin: Admin;
}
