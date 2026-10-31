import { Appointment } from 'orm/entities/appointments/Appointment';

import { EmployeeShortDTO } from '../shared/EmployeeShortDTO';
import { MedicalCardShortDTO } from '../shared/MedicalCardShortDTO';

export class AppointmentResponseDTO {
  id: number;
  appointment_date: Date;
  purpose: string;
  exam_results: string;
  diagnosis: string;
  total: number;
  medical_card?: MedicalCardShortDTO;
  employee?: EmployeeShortDTO;

  constructor(appointment: Appointment) {
    this.id = appointment.id;
    this.appointment_date = appointment.appointment_date;
    this.purpose = appointment.purpose;
    this.exam_results = appointment.exam_results;
    this.diagnosis = appointment.diagnosis;
    this.total = Number(appointment.total);
    if (appointment.medical_card) {
      this.medical_card = new MedicalCardShortDTO(appointment.medical_card);
    }
    if (appointment.employee) {
      this.employee = new EmployeeShortDTO(appointment.employee);
    }
  }
}
