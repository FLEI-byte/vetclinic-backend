import { Request, Response, NextFunction } from 'express';

import { validateMedicalCardDto } from 'dto/medical-cards/MedicalCardDto';
import { MedicalCardService } from 'services/medical-cards/MedicalCardService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await MedicalCardService.findAll();
    res.customSuccess(200, 'List of medical cards.', cards);
  } catch (err) {
    return next(new CustomError(400, 'Raw', `Can't retrieve list of medical cards.`, null, err));
  }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    const card = await MedicalCardService.findById(id);
    if (!card) {
      return next(
        new CustomError(404, 'General', `Medical card with id:${id} not found.`, ['Medical card not found.']),
      );
    }
    res.customSuccess(200, 'Medical card found.', card);
  } catch (err) {
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validateMedicalCardDto(req.body);
  if (errors.length > 0) {
    return next(new CustomError(400, 'Validation', 'Validation error.', errors));
  }
  try {
    const card = await MedicalCardService.create(req.body);
    if (!card) {
      return next(
        new CustomError(404, 'General', `Client with id:${req.body.client_id} not found.`, ['Client not found.']),
      );
    }
    res.customSuccess(201, 'Medical card successfully created.', card);
  } catch (err) {
    return next(new CustomError(409, 'Raw', `Medical card can't be created.`, null, err));
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const errors = validateMedicalCardDto(req.body, true);
  if (errors.length > 0) {
    return next(new CustomError(400, 'Validation', 'Validation error.', errors));
  }
  try {
    const card = await MedicalCardService.update(id, req.body);
    if (card === undefined) {
      return next(
        new CustomError(404, 'General', `Medical card with id:${id} not found.`, ['Medical card not found.']),
      );
    }
    if (card === null) {
      return next(
        new CustomError(404, 'General', `Client with id:${req.body.client_id} not found.`, ['Client not found.']),
      );
    }
    res.customSuccess(200, 'Medical card successfully updated.', card);
  } catch (err) {
    return next(new CustomError(409, 'Raw', `Medical card can't be updated.`, null, err));
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    const removed = await MedicalCardService.remove(id);
    if (!removed) {
      return next(
        new CustomError(404, 'General', `Medical card with id:${id} not found.`, ['Medical card not found.']),
      );
    }
    res.customSuccess(200, 'Medical card successfully deleted.');
  } catch (err) {
    return next(new CustomError(400, 'Raw', `Medical card can't be deleted.`, null, err));
  }
};
