import { Request, Response } from 'express';
import { OrdersService } from './orders.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class OrdersController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrdersService.viewAll();
    res.json({ success: true, data: orders });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const order = await OrdersService.viewById(id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }
    res.json({ success: true, data: order });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const order = await OrdersService.create(req.body);
    res.status(201).json({ success: true, data: order });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await OrdersService.modify(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }
    res.json({ success: true, data: updated });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await OrdersService.deleteById(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }
    res.json({ success: true, message: 'Orden eliminada' });
  });
}
