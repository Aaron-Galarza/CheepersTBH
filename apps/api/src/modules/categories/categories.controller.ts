import { Request, Response } from 'express';
import { CategoriaService } from './categories.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class CategoriaController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const categorias = await CategoriaService.viewAll();
    res.json({ success: true, data: categorias });
  });

  static getActive = asyncHandler(async (req: Request, res: Response) => {
    const categorias = await CategoriaService.viewActive();
    res.json({ success: true, data: categorias });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const categoria = await CategoriaService.viewById(id);
    if (!categoria) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }
    res.json({ success: true, data: categoria });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const categoria = await CategoriaService.create(req.body);
    res.status(201).json({ success: true, data: categoria });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await CategoriaService.modify(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }
    res.json({ success: true, data: updated });
  });

  static toggleActive = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await CategoriaService.toggleActive(id);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }
    res.json({ success: true, data: updated });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await CategoriaService.deleteById(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }
    res.json({ success: true, message: 'Categoría eliminada' });
  });
}
