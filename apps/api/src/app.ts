import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { requestLogger } from './middlewares/logger.middleware';
import { DEFAULT_CLIENT_URL } from './constants';

const app: Express = express();

// Middlewares de seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || DEFAULT_CLIENT_URL,
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(requestLogger);

// Routes
app.use('/api', routes);

// Error handler (al final de todos)
app.use(errorHandler);

export default app;
