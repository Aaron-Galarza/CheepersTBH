import { ConfigModel, IConfig } from './config.model';

export const ConfigService = {
  getStatus: async (): Promise<IConfig> => {
    return await ConfigService.getOrCreateConfig();
  },

  getOrCreateConfig: async (): Promise<IConfig> => {
    return await ConfigModel.getOrCreateConfig();
  },

  updateSchedule: async (dailySchedule: any[]): Promise<IConfig | null> => {
    return await ConfigModel.findOneAndUpdate({}, { dailySchedule }, { new: true });
  },

  toggleEmergencyClosed: async (): Promise<IConfig | null> => {
    const config = await ConfigModel.findOne();
    if (!config) {
      const newConfig = await ConfigModel.create({ isEmergencyClosed: true });
      return newConfig;
    }
    config.isEmergencyClosed = !config.isEmergencyClosed;
    return await config.save();
  },

  updateEmergencyMessage: async (message: string): Promise<IConfig | null> => {
    return await ConfigModel.findOneAndUpdate({}, { emergencyMessage: message }, { new: true });
  },

  updateBanner: async (banner: string): Promise<IConfig | null> => {
    return await ConfigModel.findOneAndUpdate({}, { banner }, { new: true });
  },
};
