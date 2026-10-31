import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';

import { checkAppointmentBody } from './appointmentRules';

export async function validatorUpdateAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = checkAppointmentBody(req.body, true);
    if (errors.length > 0) {
      throw new CustomError(400, 'Validation', 'Validation error.', errors);
    }
    return next();
  } catch (err) {
    return next(err);
  }
}
