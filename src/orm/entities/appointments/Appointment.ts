import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Employee } from '../employees/Employee';
import { MedicalCard } from '../medical-cards/MedicalCard';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MedicalCard, (card) => card.appointments, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medical_card_id' })
  medical_card: MedicalCard;

  @ManyToOne(() => Employee, (employee) => employee.appointments, { nullable: false })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'timestamp' })
  appointment_date: Date;

  @Column({ type: 'text' })
  purpose: string;

  @Column({ type: 'text', nullable: true })
  exam_results: string;

  @Column({ length: 255, nullable: true })
  diagnosis: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;
}
