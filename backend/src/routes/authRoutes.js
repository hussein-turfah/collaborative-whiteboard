import { register, login, refresh } from '../controllers/authController.js';
import { validate } from '../middleware/validationMiddleware.js';
import { registerSchema, loginSchema, refreshSchema } from '../utils/validation.js';

export default (app) => {
  app.post('/auth/register', validate(registerSchema), register);
  app.post('/auth/login', validate(loginSchema), login);
  app.post('/auth/refresh', validate(refreshSchema), refresh);
};
