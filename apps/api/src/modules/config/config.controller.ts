import { Request, Response } from 'express';
import { ConfigService } from './config.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendError } from '../../utils/response';

export class ConfigController {
  static getStatus = asyncHandler(async (req: Request, res: Response) => {
    const config = await ConfigService.getStatus();
    sendSuccess(res, config);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const config = await ConfigService.update(req.body);
    sendSuccess(res, config, 200, 'Configuración actualizada');
  });

  static toggleEmergency = asyncHandler(async (req: Request, res: Response) => {
    const config = await ConfigService.toggleEmergency();
    sendSuccess(res, config, 200, 'Estado de emergencia toggled');
  });

  static updateSchedule = asyncHandler(async (req: Request, res: Response) => {
    const { dailySchedule } = req.body;
    if (!Array.isArray(dailySchedule)) {
      return sendError(res, 'dailySchedule debe ser un array', 400);
    }
    const config = await ConfigService.updateSchedule(dailySchedule);
    sendSuccess(res, config, 200, 'Horarios actualizados');
  });

  static updateBanner = asyncHandler(async (req: Request, res: Response) => {
    const { banner } = req.body;
    if (!banner) {
      return sendError(res, 'El banner es requerido', 400);
    }
    const config = await ConfigService.update({ banner });
    sendSuccess(res, config, 200, 'Banner actualizado');
  });
}
