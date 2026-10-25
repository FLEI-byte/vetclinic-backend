import { getRepository } from 'typeorm';

import { EmployeeDto } from 'dto/employees/EmployeeDto';
import { Employee } from 'orm/entities/employees/Employee';

export class EmployeeService {
  private static repo() {
    return getRepository(Employee);
  }

  static findAll() {
    return this.repo().find({ relations: ['appointments'], order: { id: 'ASC' } });
  }

  static findById(id: number) {
    return this.repo().findOne(id, { relations: ['appointments'] });
  }

  static async create(data: EmployeeDto) {
    const employee = this.repo().create(data);
    return this.repo().save(employee);
  }

  static async update(id: number, data: Partial<EmployeeDto>) {
    const employee = await this.repo().findOne(id);
    if (!employee) return undefined;
    Object.assign(employee, data);
    return this.repo().save(employee);
  }

  static async remove(id: number) {
    const employee = await this.repo().findOne(id);
    if (!employee) return false;
    await this.repo().remove(employee);
    return true;
  }
}
