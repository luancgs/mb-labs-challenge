import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 30 })
  email: string;

  @Column({ select: false, length: 60 })
  password: string;

  @Column('timestamp')
  createdAt: Date;
}
