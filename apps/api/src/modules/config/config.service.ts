import { ConfigModel, IConfig } from './config.model';

export const ConfigService = {
  getOrCreateConfig: async (): Promise<IConfig> => {
    return await ConfigModel.getOrCreateConfig();
  },

  getStatus: async (): Promise<IConfig> => {
    return await ConfigService.getOrCreateConfig();
  },

  update: async (data: Partial<IConfig>): Promise<IConfig | null> => {
    return await ConfigModel.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
  },

  toggleEmergency: async (): Promise<IConfig> => {
    const config = await ConfigService.getOrCreateConfig();
    config.isEmergencyClosed = !config.isEmergencyClosed;
    return await config.save();
  },

  updateEmergencyMessage: async (message: string): Promise<IConfig> => {
    const config = await ConfigService.getOrCreateConfig();
    config.emergencyMessage = message;
    return await config.save();
  },

  updateSchedule: async (dailySchedule: any[]): Promise<IConfig | null> => {
    return await ConfigService.update({ dailySchedule });
  },

  updateBanner: async (banner: string): Promise<IConfig | null> => {
    return await ConfigService.update({ banner });
  },
};
