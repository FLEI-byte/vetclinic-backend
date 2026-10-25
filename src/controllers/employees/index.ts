import { Request, Response, NextFunction } from 'express';

import { validateEmployeeDto } from 'dto/employees/EmployeeDto';
import { EmployeeService } from 'services/employees/EmployeeService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employees = await EmployeeService.findAll();
    res.customSuccess(200, 'List of employees.', employees);
  } catch (err) {
    return next(new CustomError(400, 'Raw', `Can't retrieve list of employees.`, null, err));
  }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    const employee = await EmployeeService.findById(id);
    if (!employee) {
      return next(new CustomError(404, 'General', `Employee with id:${id} not found.`, ['Employee not found.']));
    }
    res.customSuccess(200, 'Employee found.', employee);
  } catch (err) {
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validateEmployeeDto(req.body);
  if (errors.length > 0) {
    return next(new CustomError(400, 'Validation', 'Validation error.', errors));
  }
  try {
    const employee = await EmployeeService.create(req.body);
    res.customSuccess(201, 'Employee successfully created.', employee);
  } catch (err) {
    return next(new CustomError(409, 'Raw', `Employee can't be created.`, null, err));
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const errors = validateEmployeeDto(req.body, true);
  if (errors.length > 0) {
    return next(new CustomError(400, 'Validation', 'Validation error.', errors));
  }
  try {
    const employee = await EmployeeService.update(id, req.body);
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
  try {
    const removed = await EmployeeService.remove(id);
    if (!removed) {
      return next(new CustomError(404, 'General', `Employee with id:${id} not found.`, ['Employee not found.']));
    }
    res.customSuccess(200, 'Employee successfully deleted.');
  } catch (err) {
    return next(new CustomError(409, 'Raw', `Employee can't be deleted.`, null, err));
  }
};
