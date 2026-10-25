import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Appointment } from '../appointments/Appointment';

@Entity('employees')
export class Employee {
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

  @Column({ length: 50 })
  position: string;

  @Column({ length: 255, unique: true })
  email: string;

  @OneToMany(() => Appointment, (appointment) => appointment.employee)
  appointments: Appointment[];
}
