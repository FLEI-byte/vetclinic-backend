import { getRepository } from 'typeorm';

import { AppointmentDto } from 'dto/appointments/AppointmentDto';
import { Appointment } from 'orm/entities/appointments/Appointment';
import { Employee } from 'orm/entities/employees/Employee';
import { MedicalCard } from 'orm/entities/medical-cards/MedicalCard';

const RELATIONS = ['medical_card', 'medical_card.client', 'employee'];

export type RefError = 'MEDICAL_CARD_NOT_FOUND' | 'EMPLOYEE_NOT_FOUND';

export class AppointmentService {
  private appointmentRepository = getRepository(Appointment);
  private medicalCardRepository = getRepository(MedicalCard);
  private employeeRepository = getRepository(Employee);

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({ relations: RELATIONS, order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Appointment | undefined> {
    return this.appointmentRepository.findOne(id, { relations: RELATIONS });
  }

  async create(data: AppointmentDto): Promise<Appointment | RefError | undefined> {
    const { medical_card_id, employee_id, appointment_date, ...rest } = data;
    const medical_card = await this.medicalCardRepository.findOne(medical_card_id);
    if (!medical_card) return 'MEDICAL_CARD_NOT_FOUND';
    const employee = await this.employeeRepository.findOne(employee_id);
    if (!employee) return 'EMPLOYEE_NOT_FOUND';
    const appointment = this.appointmentRepository.create({
      ...rest,
      appointment_date: new Date(appointment_date),
      medical_card,
      employee,
    });
    const saved = await this.appointmentRepository.save(appointment);
    return this.findOne(saved.id);
  }

  async update(id: number, data: Partial<AppointmentDto>): Promise<Appointment | RefError | undefined> {
    const appointment = await this.appointmentRepository.findOne(id);
    if (!appointment) return undefined;
    const { medical_card_id, employee_id, appointment_date, ...rest } = data;
    if (medical_card_id !== undefined) {
      const medical_card = await this.medicalCardRepository.findOne(medical_card_id);
      if (!medical_card) return 'MEDICAL_CARD_NOT_FOUND';
      appointment.medical_card = medical_card;
    }
    if (employee_id !== undefined) {
      const employee = await this.employeeRepository.findOne(employee_id);
      if (!employee) return 'EMPLOYEE_NOT_FOUND';
      appointment.employee = employee;
    }
    if (appointment_date !== undefined) {
      appointment.appointment_date = new Date(appointment_date);
    }
    Object.assign(appointment, rest);
    await this.appointmentRepository.save(appointment);
    return this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const appointment = await this.appointmentRepository.findOne(id);
    if (!appointment) return false;
    await this.appointmentRepository.remove(appointment);
    return true;
  }
}
