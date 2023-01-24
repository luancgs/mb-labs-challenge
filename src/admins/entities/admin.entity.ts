import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  @ApiPropertyOptional()
  id: number;

  @Column({ length: 100 })
  @ApiProperty()
  name: string;

  @Column({ length: 30 })
  @ApiProperty()
  email: string;

  @Column({ select: false, length: 60 })
  @ApiProperty()
  password: string;

  @Column('timestamp')
  @ApiPropertyOptional()
  createdAt: Date;
}
