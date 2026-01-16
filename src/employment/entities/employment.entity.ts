import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Employment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  type: string;

  @Column()
  hoursPerDay: number;

  @Column()
  pricePerHour: number;
}
