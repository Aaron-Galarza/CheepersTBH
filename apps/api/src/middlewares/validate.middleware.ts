import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue: any) => ({
          field: issue.path.join('.') || 'root',
          message: issue.message,
          code: issue.code,
        }));

        return res.status(400).json({
          success: false,
          error: 'Validación fallida',
          details: errors,
        });
      }

      res.status(400).json({
        success: false,
        error: 'Validación fallida',
      });
    }
  };
}
