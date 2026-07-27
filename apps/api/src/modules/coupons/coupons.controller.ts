import { Request, Response } from 'express';
import { CouponService } from './coupons.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class CouponController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const coupons = await CouponService.viewAll();
    res.json({ success: true, data: coupons });
  });

  static getActive = asyncHandler(async (req: Request, res: Response) => {
    const coupons = await CouponService.viewActive();
    res.json({ success: true, data: coupons });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const coupon = await CouponService.viewById(id);
    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Cupón no encontrado' });
    }
    res.json({ success: true, data: coupon });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await CouponService.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await CouponService.modify(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Cupón no encontrado' });
    }
    res.json({ success: true, data: updated });
  });

  static toggleActive = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await CouponService.toggleActive(id);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Cupón no encontrado' });
    }
    res.json({ success: true, data: updated });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await CouponService.deleteById(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Cupón no encontrado' });
    }
    res.json({ success: true, message: 'Cupón eliminado' });
  });
}
