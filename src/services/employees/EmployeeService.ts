import { getRepository } from 'typeorm';

import { EmployeeDto } from 'dto/employees/EmployeeDto';
import { Employee } from 'orm/entities/employees/Employee';

export class EmployeeService {
  private employeeRepository = getRepository(Employee);

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({ relations: ['appointments'], order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Employee | undefined> {
    return this.employeeRepository.findOne(id, { relations: ['appointments'] });
  }

  async create(data: EmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create(data);
    return this.employeeRepository.save(employee);
  }

  async update(id: number, data: Partial<EmployeeDto>): Promise<Employee | undefined> {
    const employee = await this.employeeRepository.findOne(id);
    if (!employee) return undefined;
    Object.assign(employee, data);
    return this.employeeRepository.save(employee);
  }

  async delete(id: number): Promise<boolean> {
    const employee = await this.employeeRepository.findOne(id);
    if (!employee) return false;
    await this.employeeRepository.remove(employee);
    return true;
  }
}
