import { Request, Response } from 'express';
import { CouponsService } from './coupons.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendError } from '../../utils/response';

export class CouponsController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const coupons = await CouponsService.viewAll();
    sendSuccess(res, coupons, 200);
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await CouponsService.create(req.body);
    sendSuccess(res, coupon, 201, 'Cupón creado exitosamente');
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const coupon = await CouponsService.modify(id, req.body);
    if (!coupon) {
      return sendError(res, 'Cupón no encontrado', 404);
    }
    sendSuccess(res, coupon, 200, 'Cupón actualizado');
  });

  static toggleActive = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const coupon = await CouponsService.toggleActive(id);
    if (!coupon) {
      return sendError(res, 'Cupón no encontrado', 404);
    }
    sendSuccess(res, coupon, 200);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const deleted = await CouponsService.deleteById(id);
    if (!deleted) {
      return sendError(res, 'Cupón no encontrado', 404);
    }
    sendSuccess(res, { id }, 200, 'Cupón eliminado');
  });

  static validate = asyncHandler(async (req: Request, res: Response) => {
    const { code, paymentMethod } = req.body;
    if (!code) {
      return sendError(res, 'El código del cupón es requerido', 400);
    }

    try {
      const coupon = await CouponsService.validateCoupon(code, paymentMethod);
      sendSuccess(res, coupon, 200);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  });
}
