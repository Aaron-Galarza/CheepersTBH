import { Request, Response } from 'express';
import { OrdersService } from './orders.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendError } from '../../utils/response';

// TODO: importar generateComandaText desde ../../utils/generateComanda cuando esté listo

export class OrdersController {
  static createOrder = asyncHandler(async (req: Request, res: Response) => {
    const order = await OrdersService.createOrder(req.body);
    sendSuccess(res, order, 201, 'Orden creada exitosamente');
  });

  static getOrder = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const order = await OrdersService.getOrderById(id);
    if (!order) {
      return sendError(res, 'Orden no encontrada', 404);
    }
    sendSuccess(res, order);
  });

  // TODO: implementar comanda cuando se necesite
  // static getComanda = asyncHandler(async (req: Request, res: Response) => { ... });

  static getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrdersService.getAllOrders();
    sendSuccess(res, orders);
  });

  static getOrdersByStatus = asyncHandler(async (req: Request, res: Response) => {
    const status = req.params.status as string;
    const orders = await OrdersService.getOrdersByStatus(status);
    sendSuccess(res, orders);
  });

  static updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!status) {
      return sendError(res, 'El estado es requerido', 400);
    }

    const order = await OrdersService.updateOrderStatus(id, status);
    if (!order) {
      return sendError(res, 'Orden no encontrada', 404);
    }
    sendSuccess(res, order, 200, 'Estado actualizado');
  });

  static updateDeliveryCost = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { deliveryCost } = req.body;

    if (typeof deliveryCost !== 'number' || deliveryCost < 0) {
      return sendError(res, 'El costo de envío debe ser un número positivo', 400);
    }

    const order = await OrdersService.updateDeliveryCost(id, deliveryCost);
    if (!order) {
      return sendError(res, 'Orden no encontrada', 404);
    }
    sendSuccess(res, order, 200, 'Costo de envío actualizado');
  });
}
