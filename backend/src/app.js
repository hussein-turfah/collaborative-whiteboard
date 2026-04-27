import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import canvasRoutes from './routes/canvasRoutes.js';
import strokeRoutes from './routes/strokeRoutes.js';
import env from './config/env.js';

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

authRoutes(app);
canvasRoutes(app);
strokeRoutes(app);

app.use(errorHandler);

export default app;
