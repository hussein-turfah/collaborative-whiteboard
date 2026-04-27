import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});

export const createCanvasSchema = Joi.object({
  name: Joi.string().min(1).max(255).required()
});

export const createStrokeSchema = Joi.object({
  points: Joi.array()
    .items(
      Joi.object({
        x: Joi.number().required(),
        y: Joi.number().required()
      })
    )
    .min(1)
    .required(),
  color: Joi.string()
    .regex(/^#[0-9A-F]{6}$/i)
    .required(),
  size: Joi.number().min(1).max(20).required()
});
