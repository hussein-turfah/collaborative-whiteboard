import Canvas from '../models/Canvas.js';
import { NotFoundError, AuthorizationError } from '../utils/errors.js';

export const listCanvases = async (req, res, next) => {
  try {
    const canvases = await Canvas.findByUser(req.user.userId);
    res.status(200).json(canvases);
  } catch (err) {
    next(err);
  }
};

export const createCanvas = async (req, res, next) => {
  try {
    const { name } = req.validatedBody;
    const canvas = await Canvas.createCanvas(name, req.user.userId);
    res.status(201).json(canvas);
  } catch (err) {
    next(err);
  }
};

export const getCanvas = async (req, res, next) => {
  try {
    const { canvasId } = req.params;
    const canvas = await Canvas.getCanvasWithStrokes(canvasId);

    if (!canvas) {
      throw new NotFoundError('Canvas not found');
    }

    res.status(200).json(canvas);
  } catch (err) {
    next(err);
  }
};

export const deleteCanvas = async (req, res, next) => {
  try {
    const { canvasId } = req.params;
    const canvas = await Canvas.findByPk(canvasId);

    if (!canvas) {
      throw new NotFoundError('Canvas not found');
    }

    if (canvas.created_by !== req.user.userId) {
      throw new AuthorizationError('Cannot delete canvas you do not own');
    }

    await canvas.destroy();
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
