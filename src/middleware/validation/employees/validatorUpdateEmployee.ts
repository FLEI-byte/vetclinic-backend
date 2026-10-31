import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';

import { checkEmployeeBody } from './employeeRules';

export async function validatorUpdateEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = checkEmployeeBody(req.body, true);
    if (errors.length > 0) {
      throw new CustomError(400, 'Validation', 'Validation error.', errors);
    }
    return next();
  } catch (err) {
    return next(err);
  }
}
