import {
  listCanvases,
  createCanvas,
  getCanvas,
  deleteCanvas
} from '../controllers/canvasController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { createCanvasSchema } from '../utils/validation.js';

export default (app) => {
  app.get('/api/canvases', authMiddleware, listCanvases);
  app.post('/api/canvases', authMiddleware, validate(createCanvasSchema), createCanvas);
  app.get('/api/canvases/:canvasId', authMiddleware, getCanvas);
  app.delete('/api/canvases/:canvasId', authMiddleware, deleteCanvas);
};
