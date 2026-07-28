import { Request, Response } from 'express';
import { BannersService } from './banners.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendError } from '../../utils/response';

export class BannersController {
  static getPublic = asyncHandler(async (req: Request, res: Response) => {
    const banners = await BannersService.getPublic();
    sendSuccess(res, banners);
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const banners = await BannersService.viewAll();
    sendSuccess(res, banners);
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const banner = await BannersService.create(req.body);
    sendSuccess(res, banner, 201, 'Banner creado exitosamente');
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const banner = await BannersService.modify(id, req.body);
    if (!banner) {
      return sendError(res, 'Banner no encontrado', 404);
    }
    sendSuccess(res, banner, 200, 'Banner actualizado');
  });

  static toggleActive = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const banner = await BannersService.toggleActive(id);
    if (!banner) {
      return sendError(res, 'Banner no encontrado', 404);
    }
    sendSuccess(res, banner, 200, 'Estado actualizado');
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await BannersService.deleteById(id);
    if (!deleted) {
      return sendError(res, 'Banner no encontrado', 404);
    }
    sendSuccess(res, { id }, 200, 'Banner eliminado');
  });
}
