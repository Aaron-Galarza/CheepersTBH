import { Request, Response } from 'express';
import { ConfigService } from './config.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class ConfigController {
  static getConfig = asyncHandler(async (req: Request, res: Response) => {
    const config = await ConfigService.getConfig();
    res.json({ success: true, data: config });
  });

  static updateConfig = asyncHandler(async (req: Request, res: Response) => {
    const config = await ConfigService.getConfig();
    const updated = await ConfigService.modify(config._id.toString(), req.body);
    if (!updated) {
      return res.status(500).json({ success: false, error: 'Error al actualizar configuración' });
    }
    res.json({ success: true, data: updated });
  });
}
