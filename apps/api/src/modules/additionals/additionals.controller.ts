import { Request, Response } from 'express';
import { AdditionalsService } from './additionals.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendError } from '../../utils/response';

export class AdditionalsController {
  static getPublic = asyncHandler(async (req: Request, res: Response) => {
    const additionals = await AdditionalsService.viewPublic();
    sendSuccess(res, additionals);
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const additionals = await AdditionalsService.viewAll();
    sendSuccess(res, additionals);
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const adicional = await AdditionalsService.create(req.body);
    sendSuccess(res, adicional, 201, 'Adicional creado');
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const adicional = await AdditionalsService.modify(id, req.body);
    if (!adicional) {
      return sendError(res, 'Adicional no encontrado', 404);
    }
    sendSuccess(res, adicional, 200, 'Adicional actualizado');
  });

  static toggleActive = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const adicional = await AdditionalsService.toggleActive(id);
    if (!adicional) {
      return sendError(res, 'Adicional no encontrado', 404);
    }
    sendSuccess(res, adicional, 200, 'Estado actualizado');
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await AdditionalsService.deleteById(id);
    if (!deleted) {
      return sendError(res, 'Adicional no encontrado', 404);
    }
    sendSuccess(res, { id }, 200, 'Adicional eliminado');
  });
}
