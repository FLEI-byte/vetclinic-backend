import { Request, Response, NextFunction } from 'express';

import { EmployeeResponseDTO } from 'dto/employees/EmployeeResponseDTO';
import { EmployeeService } from 'services/employees/EmployeeService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const employeeService = new EmployeeService();
  try {
    const employees = await employeeService.findAll();
    res.customSuccess(
      200,
      'List of employees.',
      employees.map((employee) => new EmployeeResponseDTO(employee)),
    );
  } catch (err) {
    return next(new CustomError(400, 'Raw', `Can't retrieve list of employees.`, null, err));
  }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const employeeService = new EmployeeService();
  try {
    const employee = await employeeService.findOne(id);
    if (!employee) {
      return next(new CustomError(404, 'General', `Employee with id:${id} not found.`, ['Employee not found.']));
    }
    res.customSuccess(200, 'Employee found.', new EmployeeResponseDTO(employee));
  } catch (err) {
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const employeeService = new EmployeeService();
  try {
    const employee = await employeeService.create(req.body);
    res.customSuccess(201, 'Employee successfully created.', new EmployeeResponseDTO(employee));
  } catch (err) {
    return next(new CustomError(409, 'Raw', `Employee can't be created.`, null, err));
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const employeeService = new EmployeeService();
  try {
    const employee = await employeeService.update(id, req.body);
    if (!employee) {
      return next(new CustomError(404, 'General', `Employee with id:${id} not found.`, ['Employee not found.']));
    }
    res.customSuccess(200, 'Employee successfully updated.', new EmployeeResponseDTO(employee));
  } catch (err) {
    return next(new CustomError(409, 'Raw', `Employee can't be updated.`, null, err));
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const employeeService = new EmployeeService();
  try {
    const removed = await employeeService.delete(id);
    if (!removed) {
      return next(new CustomError(404, 'General', `Employee with id:${id} not found.`, ['Employee not found.']));
    }
    res.customSuccess(200, 'Employee successfully deleted.');
  } catch (err) {
    return next(new CustomError(400, 'Raw', `Employee can't be deleted.`, null, err));
  }
};
