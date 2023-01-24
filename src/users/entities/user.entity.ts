import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
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
