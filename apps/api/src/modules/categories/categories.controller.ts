import { Request, Response } from 'express';
import { CategoriesService } from './categories.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendError } from '../../utils/response';

export class CategoriesController {
  static getPublic = asyncHandler(async (req: Request, res: Response) => {
    const categories = await CategoriesService.viewPublic();
    sendSuccess(res, categories);
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const categories = await CategoriesService.viewAll();
    sendSuccess(res, categories);
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const category = await CategoriesService.create(req.body);
    sendSuccess(res, category, 201, 'Categoría creada');
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const category = await CategoriesService.modify(id, req.body);
    if (!category) {
      return sendError(res, 'Categoría no encontrada', 404);
    }
    sendSuccess(res, category, 200, 'Categoría actualizada');
  });

  static toggleActive = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const category = await CategoriesService.toggleActive(id);
    if (!category) {
      return sendError(res, 'Categoría no encontrada', 404);
    }
    sendSuccess(res, category, 200, 'Estado actualizado');
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    try {
      const deleted = await CategoriesService.deleteById(id);
      if (!deleted) {
        return sendError(res, 'Categoría no encontrada', 404);
      }
      sendSuccess(res, { id }, 200, 'Categoría eliminada');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  });
}
