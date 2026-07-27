import { Request, Response } from 'express';
import { AdicionalService } from './additionals.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class AdicionalController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const adicionales = await AdicionalService.viewAll();
    res.json({ success: true, data: adicionales });
  });

  static getActive = asyncHandler(async (req: Request, res: Response) => {
    const adicionales = await AdicionalService.viewActive();
    res.json({ success: true, data: adicionales });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const adicional = await AdicionalService.viewById(id);
    if (!adicional) {
      return res.status(404).json({ success: false, error: 'Adicional no encontrado' });
    }
    res.json({ success: true, data: adicional });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const adicional = await AdicionalService.create(req.body);
    res.status(201).json({ success: true, data: adicional });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await AdicionalService.modify(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Adicional no encontrado' });
    }
    res.json({ success: true, data: updated });
  });

  static toggleActive = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await AdicionalService.toggleActive(id);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Adicional no encontrado' });
    }
    res.json({ success: true, data: updated });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await AdicionalService.deleteById(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Adicional no encontrado' });
    }
    res.json({ success: true, message: 'Adicional eliminado' });
  });
}
