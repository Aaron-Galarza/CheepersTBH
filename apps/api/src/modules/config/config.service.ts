import { ConfigModel } from './config.model';

export const ConfigService = {
  getConfig: async () => {
    return await ConfigModel.getOrCreateConfig();
  },

  modify: async (id: string, data: any) => {
    return await ConfigModel.findByIdAndUpdate(id, data, { new: true });
  },
};
