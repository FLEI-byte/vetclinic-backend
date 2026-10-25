import { getRepository } from 'typeorm';

import { AppointmentDto } from 'dto/appointments/AppointmentDto';
import { Appointment } from 'orm/entities/appointments/Appointment';
import { Employee } from 'orm/entities/employees/Employee';
import { MedicalCard } from 'orm/entities/medical-cards/MedicalCard';

const RELATIONS = ['medical_card', 'medical_card.client', 'employee'];

export type RefError = 'MEDICAL_CARD_NOT_FOUND' | 'EMPLOYEE_NOT_FOUND';

export class AppointmentService {
  private static repo() {
    return getRepository(Appointment);
  }

  static findAll() {
    return this.repo().find({ relations: RELATIONS, order: { id: 'ASC' } });
  }

  static findById(id: number) {
    return this.repo().findOne(id, { relations: RELATIONS });
  }

  static async create(data: AppointmentDto) {
    const { medical_card_id, employee_id, appointment_date, ...rest } = data;
    const medical_card = await getRepository(MedicalCard).findOne(medical_card_id);
    if (!medical_card) return 'MEDICAL_CARD_NOT_FOUND' as RefError;
    const employee = await getRepository(Employee).findOne(employee_id);
    if (!employee) return 'EMPLOYEE_NOT_FOUND' as RefError;
    const appointment = this.repo().create({
      ...rest,
      appointment_date: new Date(appointment_date),
      medical_card,
      employee,
    });
    const saved = await this.repo().save(appointment);
    return this.findById(saved.id);
  }

  static async update(id: number, data: Partial<AppointmentDto>) {
    const appointment = await this.repo().findOne(id);
    if (!appointment) return undefined;
    const { medical_card_id, employee_id, appointment_date, ...rest } = data;
    if (medical_card_id !== undefined) {
      const medical_card = await getRepository(MedicalCard).findOne(medical_card_id);
      if (!medical_card) return 'MEDICAL_CARD_NOT_FOUND' as RefError;
      appointment.medical_card = medical_card;
    }
    if (employee_id !== undefined) {
      const employee = await getRepository(Employee).findOne(employee_id);
      if (!employee) return 'EMPLOYEE_NOT_FOUND' as RefError;
      appointment.employee = employee;
    }
    if (appointment_date !== undefined) {
      appointment.appointment_date = new Date(appointment_date);
    }
    Object.assign(appointment, rest);
    await this.repo().save(appointment);
    return this.findById(id);
  }

  static async remove(id: number) {
    const appointment = await this.repo().findOne(id);
    if (!appointment) return false;
    await this.repo().remove(appointment);
    return true;
  }
}
