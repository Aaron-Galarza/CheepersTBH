import { Request, Response } from 'express';
import { ProductsService } from './products.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class ProductsController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductsService.viewAll();
    res.json({ success: true, data: products });
  });

  static getActive = asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductsService.viewActive();
    res.json({ success: true, data: products });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await ProductsService.viewById(id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    res.json({ success: true, data: product });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductsService.create(req.body);
    res.status(201).json({ success: true, data: product });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await ProductsService.modify(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    res.json({ success: true, data: updated });
  });

  static toggleActive = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await ProductsService.toggleActive(id);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    res.json({ success: true, data: updated });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await ProductsService.deleteById(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    res.json({ success: true, message: 'Producto eliminado' });
  });
}
