import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

import { Appointment } from '../appointments/Appointment';
import { Client } from '../clients/Client';

@Entity('medical_cards')
export class MedicalCard {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.medical_cards, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ length: 50 })
  nickname: string;

  @Column({ length: 50 })
  species: string;

  @Column({ length: 50 })
  breed: string;

  @Column({ length: 10 })
  sex: string;

  @Column({ type: 'date' })
  birth_date: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  created_date: string;

  @OneToMany(() => Appointment, (appointment) => appointment.medical_card)
  appointments: Appointment[];
}
