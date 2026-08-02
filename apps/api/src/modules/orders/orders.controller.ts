import { Request, Response } from 'express';
import { OrdersService } from './orders.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendError } from '../../utils/response';
import { ORDER_STATUSES } from '../../constants';

export class OrdersController {
  static createOrder = asyncHandler(async (req: Request, res: Response) => {
    const order = await OrdersService.createOrder(req.body);
    sendSuccess(res, order, 201, 'Orden creada exitosamente');
  });

  static getOrder = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const order = await OrdersService.viewById(id);
    if (!order) {
      return sendError(res, 'Orden no encontrada', 404);
    }
    sendSuccess(res, order);
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const orders = await OrdersService.viewAll(filter);

    sendSuccess(res, { orders, total: orders.length }, 200);
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const order = await OrdersService.viewById(id);

    if (!order) {
      return sendError(res, 'Orden no encontrada', 404);
    }

    sendSuccess(res, order, 200);
  });

  static updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!status) {
      return sendError(res, 'El estado es requerido', 400);
    }

    try {
      const order = await OrdersService.updateStatus(id, status);

      if (!order) {
        return sendError(res, 'Orden no encontrada', 404);
      }

      // Emitir evento a través de Socket.IO
      if (globalThis.io) {
        globalThis.io.to('kitchen').emit('order-updated', {
          orderId: order._id,
          status: order.status,
          customer: order.customer.name,
        });
      }

      sendSuccess(res, order, 200, 'Estado actualizado');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const deleted = await OrdersService.deleteById(id);

    if (!deleted) {
      return sendError(res, 'Orden no encontrada', 404);
    }

    // Emitir evento de eliminación
    if (globalThis.io) {
      globalThis.io.to('kitchen').emit('order-deleted', {
        orderId: id,
      });
    }

    sendSuccess(res, { id }, 200, 'Orden eliminada');
  });

  static updateDeliveryCost = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { deliveryCost } = req.body;

    const order = await OrdersService.updateDeliveryCost(id, deliveryCost);
    if (!order) {
      return sendError(res, 'Orden no encontrada', 404);
    }
    sendSuccess(res, order, 200, 'Costo de envío actualizado');
  });

  static getStats = asyncHandler(async (req: Request, res: Response) => {
    const counts = await Promise.all(
      ORDER_STATUSES.map((status) => OrdersService.countByStatus(status))
    );

    const stats: Record<string, number> = {};
    for (let i = 0; i < ORDER_STATUSES.length; i++) {
      stats[ORDER_STATUSES[i]] = counts[i];
    }

    sendSuccess(res, stats, 200);
  });
}
