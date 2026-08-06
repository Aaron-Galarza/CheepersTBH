import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { GalleryService } from './gallery.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendError } from '../../utils/response';
import { AppError } from '../../utils/appError';

const MAX_SIZE_MB = 5;

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Solo se permiten imágenes', 400));
    }
  },
}).single('image');

const upload = (req: Request, res: Response, next: NextFunction) => {
  uploadMiddleware(req, res, (err: any) => {
    if (err) {
      return next(err instanceof AppError ? err : new AppError('Error al subir el archivo', 400));
    }
    next();
  });
};

export const GalleryController = {
  upload,

  uploadImage: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return sendError(res, 'No se envió ninguna imagen', 400);
    }

    const image = await GalleryService.uploadImage(req.file);
    sendSuccess(res, image, 201, 'Imagen subida correctamente');
  }),

  list: asyncHandler(async (_req: Request, res: Response) => {
    const images = await GalleryService.getGalleryImages();
    sendSuccess(res, images, 200);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const imageId = req.params.imageId as string;
    await GalleryService.deleteImage(imageId);
    sendSuccess(res, { imageId }, 200, 'Imagen eliminada');
  }),
};
