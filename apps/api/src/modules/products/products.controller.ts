import { Request, Response } from 'express';
import { ProductsService } from './products.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendError } from '../../utils/response';

export class ProductsController {
  static getPublic = asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductsService.viewPublic();
    sendSuccess(res, products);
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductsService.viewAll();
    sendSuccess(res, products);
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await ProductsService.viewById(id);
    if (!product) {
      return sendError(res, 'Producto no encontrado', 404);
    }
    sendSuccess(res, product);
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductsService.create(req.body);
    sendSuccess(res, product, 201, 'Producto creado');
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await ProductsService.modify(id, req.body);
    if (!product) {
      return sendError(res, 'Producto no encontrado', 404);
    }
    sendSuccess(res, product, 200, 'Producto actualizado');
  });

  static toggleActive = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await ProductsService.toggleActive(id);
    if (!product) {
      return sendError(res, 'Producto no encontrado', 404);
    }
    sendSuccess(res, product, 200, 'Estado actualizado');
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await ProductsService.deleteById(id);
    if (!deleted) {
      return sendError(res, 'Producto no encontrado', 404);
    }
    sendSuccess(res, { id }, 200, 'Producto eliminado');
  });
}
