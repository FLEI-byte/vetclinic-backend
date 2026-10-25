import { Request, Response, NextFunction } from 'express';

import { validateAppointmentDto } from 'dto/appointments/AppointmentDto';
import { AppointmentService } from 'services/appointments/AppointmentService';
import { CustomError } from 'utils/response/custom-error/CustomError';

const refError = (code: string, body: any) => {
  if (code === 'MEDICAL_CARD_NOT_FOUND') {
    return new CustomError(404, 'General', `Medical card with id:${body.medical_card_id} not found.`, [
      'Medical card not found.',
    ]);
  }
  return new CustomError(404, 'General', `Employee with id:${body.employee_id} not found.`, ['Employee not found.']);
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointments = await AppointmentService.findAll();
    res.customSuccess(200, 'List of appointments.', appointments);
  } catch (err) {
    return next(new CustomError(400, 'Raw', `Can't retrieve list of appointments.`, null, err));
  }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    const appointment = await AppointmentService.findById(id);
    if (!appointment) {
      return next(new CustomError(404, 'General', `Appointment with id:${id} not found.`, ['Appointment not found.']));
    }
    res.customSuccess(200, 'Appointment found.', appointment);
  } catch (err) {
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validateAppointmentDto(req.body);
  if (errors.length > 0) {
    return next(new CustomError(400, 'Validation', 'Validation error.', errors));
  }
  try {
    const result = await AppointmentService.create(req.body);
    if (result === 'MEDICAL_CARD_NOT_FOUND' || result === 'EMPLOYEE_NOT_FOUND') {
      return next(refError(result, req.body));
    }
    res.customSuccess(201, 'Appointment successfully created.', result);
  } catch (err) {
    return next(new CustomError(409, 'Raw', `Appointment can't be created.`, null, err));
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const errors = validateAppointmentDto(req.body, true);
  if (errors.length > 0) {
    return next(new CustomError(400, 'Validation', 'Validation error.', errors));
  }
  try {
    const result = await AppointmentService.update(id, req.body);
    if (result === undefined) {
      return next(new CustomError(404, 'General', `Appointment with id:${id} not found.`, ['Appointment not found.']));
    }
    if (result === 'MEDICAL_CARD_NOT_FOUND' || result === 'EMPLOYEE_NOT_FOUND') {
      return next(refError(result, req.body));
    }
    res.customSuccess(200, 'Appointment successfully updated.', result);
  } catch (err) {
    return next(new CustomError(409, 'Raw', `Appointment can't be updated.`, null, err));
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    const removed = await AppointmentService.remove(id);
    if (!removed) {
      return next(new CustomError(404, 'General', `Appointment with id:${id} not found.`, ['Appointment not found.']));
    }
    res.customSuccess(200, 'Appointment successfully deleted.');
  } catch (err) {
    return next(new CustomError(400, 'Raw', `Appointment can't be deleted.`, null, err));
  }
};
