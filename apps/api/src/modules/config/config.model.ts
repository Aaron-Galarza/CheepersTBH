import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDaySchedule {
  day: string;
  openTime: string;
  closeTime: string;
  isStoreOpen: boolean;
}

export interface IConfig extends Document {
  isOpen: boolean;
  isEmergencyClosed: boolean;
  emergencyMessage: string;
  dailySchedule: IDaySchedule[];
  isAllClose: boolean;
  banner: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IConfigModel extends Model<IConfig> {
  getOrCreateConfig(): Promise<IConfig>;
}

const dayScheduleSchema = new Schema<IDaySchedule>(
  {
    day: { type: String, required: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    isStoreOpen: { type: Boolean, required: true },
  },
  { _id: false }
);

const configSchema = new Schema<IConfig>(
  {
    isOpen: { type: Boolean, default: true },
    isEmergencyClosed: { type: Boolean, default: false },
    emergencyMessage: { type: String, default: '' },
    dailySchedule: [dayScheduleSchema],
    isAllClose: { type: Boolean, default: false },
    banner: { type: String, default: '' },
  },
  { timestamps: true }
);

configSchema.statics.getOrCreateConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({
      isOpen: true,
      isEmergencyClosed: false,
      emergencyMessage: '',
      banner: '',
      isAllClose: false,
      dailySchedule: [
        { day: 'Lunes', openTime: '20:00', closeTime: '23:00', isStoreOpen: true },
        { day: 'Martes', openTime: '20:00', closeTime: '23:00', isStoreOpen: true },
        { day: 'Miércoles', openTime: '20:00', closeTime: '23:00', isStoreOpen: true },
        { day: 'Jueves', openTime: '20:00', closeTime: '23:00', isStoreOpen: true },
        { day: 'Viernes', openTime: '20:00', closeTime: '00:00', isStoreOpen: true },
        { day: 'Sábado', openTime: '20:00', closeTime: '00:00', isStoreOpen: true },
        { day: 'Domingo', openTime: '20:00', closeTime: '23:00', isStoreOpen: true },
      ],
    });
  }
  return config;
};

export const ConfigModel = mongoose.model<IConfig, IConfigModel>('Config', configSchema);
