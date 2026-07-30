import { Request, Response } from 'express';
import { BannersService } from './banners.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendError } from '../../utils/response';

export class BannersController {
  static getPublic = asyncHandler(async (req: Request, res: Response) => {
    const banners = await BannersService.getPublic();
    sendSuccess(res, banners, 200);
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const banners = await BannersService.viewAll();
    sendSuccess(res, banners, 200);
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const banner = await BannersService.create(req.body);
    sendSuccess(res, banner, 201, 'Banner creado exitosamente');
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const banner = await BannersService.modify(id, req.body);
    if (!banner) {
      return sendError(res, 'Banner no encontrado', 404);
    }
    sendSuccess(res, banner, 200, 'Banner actualizado');
  });

  static toggleActive = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const banner = await BannersService.toggleActive(id);
    if (!banner) {
      return sendError(res, 'Banner no encontrado', 404);
    }
    sendSuccess(res, banner, 200);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const deleted = await BannersService.deleteById(id);
    if (!deleted) {
      return sendError(res, 'Banner no encontrado', 404);
    }
    sendSuccess(res, { id }, 200, 'Banner eliminado');
  });
}
