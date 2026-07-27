import { z } from 'zod';

export const DayScheduleSchema = z.object({
  day: z.string(),
  openTime: z.string(),
  closeTime: z.string(),
  isStoreOpen: z.boolean(),
});

export const ConfigUpdateSchema = z.object({
  isOpen: z.boolean().optional(),
  isEmergencyClosed: z.boolean().optional(),
  emergencyMessage: z.string().optional(),
  dailySchedule: z.array(DayScheduleSchema).optional(),
  banner: z.string().optional(),
});

export type ConfigUpdate = z.infer<typeof ConfigUpdateSchema>;
