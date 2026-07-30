import { Request, Response } from 'express';
import { ConfigService } from './config.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendError } from '../../utils/response';

export class ConfigController {
  static getStatus = asyncHandler(async (req: Request, res: Response) => {
    const config = await ConfigService.getStatus();
    sendSuccess(res, config, 200);
  });

  static updateSchedule = asyncHandler(async (req: Request, res: Response) => {
    const { dailySchedule } = req.body;
    if (!Array.isArray(dailySchedule)) {
      return sendError(res, 'dailySchedule debe ser un array', 400);
    }
    const config = await ConfigService.updateSchedule(dailySchedule);
    sendSuccess(res, config, 200, 'Horarios actualizados');
  });

  static toggleEmergency = asyncHandler(async (req: Request, res: Response) => {
    const config = await ConfigService.toggleEmergencyClosed();
    sendSuccess(res, config, 200);
  });

  static updateEmergencyMessage = asyncHandler(async (req: Request, res: Response) => {
    const { message } = req.body;
    if (!message) {
      return sendError(res, 'El mensaje es requerido', 400);
    }
    const config = await ConfigService.updateEmergencyMessage(message);
    sendSuccess(res, config, 200, 'Mensaje actualizado');
  });

  static updateBanner = asyncHandler(async (req: Request, res: Response) => {
    const { banner } = req.body;
    if (!banner) {
      return sendError(res, 'El banner es requerido', 400);
    }
    const config = await ConfigService.updateBanner(banner);
    sendSuccess(res, config, 200, 'Banner actualizado');
  });
}
