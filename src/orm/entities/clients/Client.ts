import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 13, unique: true })
  phone: string;

  @Column({ length: 30 })
  last_name: string;

  @Column({ length: 30 })
  first_name: string;

  @Column({ length: 30 })
  patronymic: string;

  @Column({ type: 'date' })
  birth_date: string;

  @Column({ length: 255, unique: true })
  email: string;
}
