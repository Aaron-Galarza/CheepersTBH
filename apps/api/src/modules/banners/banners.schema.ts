import { z } from 'zod';

export const BannerCreateSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  image: z.string().url('La imagen debe ser una URL válida'),
  order: z.number().default(0),
  active: z.boolean().default(true),
});

export const BannerUpdateSchema = BannerCreateSchema.partial();

export type BannerCreate = z.infer<typeof BannerCreateSchema>;
export type BannerUpdate = z.infer<typeof BannerUpdateSchema>;
