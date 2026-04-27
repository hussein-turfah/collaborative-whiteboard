import Stroke from '../models/Stroke.js';
import { NotFoundError } from '../utils/errors.js';

export const getStrokes = async (req, res, next) => {
  try {
    const { canvasId } = req.params;
    const strokes = await Stroke.getCanvasStrokes(canvasId);
    res.status(200).json(strokes);
  } catch (err) {
    next(err);
  }
};

export const createStroke = async (req, res, next) => {
  try {
    const { canvasId } = req.params;
    const { points, color, size } = req.validatedBody;

    const stroke = await Stroke.createStroke(
      canvasId,
      req.user.userId,
      points,
      color,
      size
    );

    res.status(201).json(stroke);
  } catch (err) {
    next(err);
  }
};

export const deleteStroke = async (req, res, next) => {
  try {
    const { strokeId } = req.params;
    const stroke = await Stroke.softDelete(strokeId, req.user.userId);
    res.status(200).json({ success: true, deleted_at: stroke.deleted_at });
  } catch (err) {
    next(err);
  }
};

export const restoreStroke = async (req, res, next) => {
  try {
    const { strokeId } = req.params;
    const stroke = await Stroke.restore(strokeId, req.user.userId);
    res.status(200).json({ success: true, deleted_at: stroke.deleted_at });
  } catch (err) {
    next(err);
  }
};
