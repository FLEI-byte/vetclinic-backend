import { Employee } from 'orm/entities/employees/Employee';

export class EmployeeShortDTO {
  id: number;
  phone: string;
  full_name: string;
  position: string;

  constructor(employee: Employee) {
    this.id = employee.id;
    this.phone = employee.phone;
    this.full_name = `${employee.last_name} ${employee.first_name} ${employee.patronymic}`;
    this.position = employee.position;
  }
}
