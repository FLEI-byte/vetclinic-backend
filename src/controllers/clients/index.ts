import { Request, Response, NextFunction } from 'express';

import { ClientService } from 'services/clients/ClientService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const clientService = new ClientService();
  try {
    const clients = await clientService.findAll();
    res.customSuccess(200, 'List of clients.', clients);
  } catch (err) {
    return next(new CustomError(400, 'Raw', `Can't retrieve list of clients.`, null, err));
  }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const clientService = new ClientService();
  try {
    const client = await clientService.findOne(id);
    if (!client) {
      return next(new CustomError(404, 'General', `Client with id:${id} not found.`, ['Client not found.']));
    }
    res.customSuccess(200, 'Client found.', client);
  } catch (err) {
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const clientService = new ClientService();
  try {
    const client = await clientService.create(req.body);
    res.customSuccess(201, 'Client successfully created.', client);
  } catch (err) {
    return next(new CustomError(409, 'Raw', `Client can't be created.`, null, err));
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const clientService = new ClientService();
  try {
    const client = await clientService.update(id, req.body);
    if (!client) {
      return next(new CustomError(404, 'General', `Client with id:${id} not found.`, ['Client not found.']));
    }
    res.customSuccess(200, 'Client successfully updated.', client);
  } catch (err) {
    return next(new CustomError(409, 'Raw', `Client can't be updated.`, null, err));
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const clientService = new ClientService();
  try {
    const removed = await clientService.delete(id);
    if (!removed) {
      return next(new CustomError(404, 'General', `Client with id:${id} not found.`, ['Client not found.']));
    }
    res.customSuccess(200, 'Client successfully deleted.');
  } catch (err) {
    return next(new CustomError(400, 'Raw', `Client can't be deleted.`, null, err));
  }
};
