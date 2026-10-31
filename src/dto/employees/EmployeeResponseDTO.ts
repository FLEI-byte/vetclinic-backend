import { Employee } from 'orm/entities/employees/Employee';

import { AppointmentShortDTO } from '../shared/AppointmentShortDTO';

export class EmployeeResponseDTO {
  id: number;
  phone: string;
  full_name: string;
  position: string;
  email: string;
  appointments?: AppointmentShortDTO[];

  constructor(employee: Employee) {
    this.id = employee.id;
    this.phone = employee.phone;
    this.full_name = `${employee.last_name} ${employee.first_name} ${employee.patronymic}`;
    this.position = employee.position;
    this.email = employee.email;
    if (employee.appointments) {
      this.appointments = employee.appointments.map((appointment) => new AppointmentShortDTO(appointment));
    }
  }
}
