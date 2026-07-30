import { Request, Response } from 'express';
import { AdditionalsService } from './additionals.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendError } from '../../utils/response';

export class AdditionalsController {
  static getPublic = asyncHandler(async (req: Request, res: Response) => {
    const additionals = await AdditionalsService.viewPublic();
    sendSuccess(res, additionals, 200);
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const additionals = await AdditionalsService.viewAll();
    sendSuccess(res, additionals, 200);
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const additional = await AdditionalsService.create(req.body);
    sendSuccess(res, additional, 201, 'Adicional creado exitosamente');
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const additional = await AdditionalsService.modify(id, req.body);
    if (!additional) {
      return sendError(res, 'Adicional no encontrado', 404);
    }
    sendSuccess(res, additional, 200, 'Adicional actualizado');
  });

  static toggleActive = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const additional = await AdditionalsService.toggleActive(id);
    if (!additional) {
      return sendError(res, 'Adicional no encontrado', 404);
    }
    sendSuccess(res, additional, 200);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const deleted = await AdditionalsService.deleteById(id);
    if (!deleted) {
      return sendError(res, 'Adicional no encontrado', 404);
    }
    sendSuccess(res, { id }, 200, 'Adicional eliminado');
  });
}
