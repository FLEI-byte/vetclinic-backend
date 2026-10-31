import { Request, Response, NextFunction } from 'express';

import { MedicalCardResponseDTO } from 'dto/medical-cards/MedicalCardResponseDTO';
import { MedicalCardService } from 'services/medical-cards/MedicalCardService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const medicalCardService = new MedicalCardService();
  try {
    const cards = await medicalCardService.findAll();
    res.customSuccess(
      200,
      'List of medical cards.',
      cards.map((card) => new MedicalCardResponseDTO(card)),
    );
  } catch (err) {
    return next(new CustomError(400, 'Raw', `Can't retrieve list of medical cards.`, null, err));
  }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const medicalCardService = new MedicalCardService();
  try {
    const card = await medicalCardService.findOne(id);
    if (!card) {
      return next(
        new CustomError(404, 'General', `Medical card with id:${id} not found.`, ['Medical card not found.']),
      );
    }
    res.customSuccess(200, 'Medical card found.', new MedicalCardResponseDTO(card));
  } catch (err) {
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const medicalCardService = new MedicalCardService();
  try {
    const card = await medicalCardService.create(req.body);
    if (!card) {
      return next(
        new CustomError(404, 'General', `Client with id:${req.body.client_id} not found.`, ['Client not found.']),
      );
    }
    res.customSuccess(201, 'Medical card successfully created.', new MedicalCardResponseDTO(card));
  } catch (err) {
    return next(new CustomError(409, 'Raw', `Medical card can't be created.`, null, err));
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const medicalCardService = new MedicalCardService();
  try {
    const card = await medicalCardService.update(id, req.body);
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
    res.customSuccess(200, 'Medical card successfully updated.', new MedicalCardResponseDTO(card));
  } catch (err) {
    return next(new CustomError(409, 'Raw', `Medical card can't be updated.`, null, err));
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const medicalCardService = new MedicalCardService();
  try {
    const removed = await medicalCardService.delete(id);
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
