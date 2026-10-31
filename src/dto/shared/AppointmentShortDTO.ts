import { Appointment } from 'orm/entities/appointments/Appointment';

export class AppointmentShortDTO {
  id: number;
  appointment_date: Date;
  purpose: string;
  diagnosis: string;
  total: number;

  constructor(appointment: Appointment) {
    this.id = appointment.id;
    this.appointment_date = appointment.appointment_date;
    this.purpose = appointment.purpose;
    this.diagnosis = appointment.diagnosis;
    this.total = Number(appointment.total);
  }
}
