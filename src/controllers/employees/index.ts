import { Request, Response, NextFunction } from 'express';

import { EmployeeService } from 'services/employees/EmployeeService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const employeeService = new EmployeeService();
  try {
    const employees = await employeeService.findAll();
    res.customSuccess(200, 'List of employees.', employees);
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
    res.customSuccess(200, 'Employee found.', employee);
  } catch (err) {
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const employeeService = new EmployeeService();
  try {
    const employee = await employeeService.create(req.body);
    res.customSuccess(201, 'Employee successfully created.', employee);
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
    res.customSuccess(200, 'Employee successfully updated.', employee);
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
