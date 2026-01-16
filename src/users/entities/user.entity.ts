import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employment } from '../../employment/entities/employment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @ManyToOne(() => Employment)
  @JoinColumn({ name: 'employmentTypeId' })
  employmentType: Employment;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
