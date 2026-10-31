import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';

import { checkMedicalCardBody } from './medicalCardRules';

export async function validatorCreateMedicalCard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = checkMedicalCardBody(req.body, false);
    if (errors.length > 0) {
      throw new CustomError(400, 'Validation', 'Validation error.', errors);
    }
    return next();
  } catch (err) {
    return next(err);
  }
}
