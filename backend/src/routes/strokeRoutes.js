import {
  getStrokes,
  createStroke,
  deleteStroke,
  restoreStroke
} from '../controllers/strokeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { createStrokeSchema } from '../utils/validation.js';

export default (app) => {
  app.get('/api/canvases/:canvasId/strokes', authMiddleware, getStrokes);
  app.post('/api/canvases/:canvasId/strokes', authMiddleware, validate(createStrokeSchema), createStroke);
  app.delete('/api/strokes/:strokeId', authMiddleware, deleteStroke);
  app.post('/api/strokes/:strokeId/restore', authMiddleware, restoreStroke);
};
