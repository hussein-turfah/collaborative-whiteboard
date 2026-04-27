import { HTTP_STATUS } from '../config/constants.js';
import {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError
} from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = HTTP_STATUS.INTERNAL_ERROR;
  let message = 'Internal server error';

  if (err instanceof ValidationError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = err.message;
  } else if (err instanceof AuthenticationError) {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = err.message;
  } else if (err instanceof AuthorizationError) {
    statusCode = HTTP_STATUS.FORBIDDEN;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = HTTP_STATUS.NOT_FOUND;
    message = err.message;
  } else if (err instanceof ConflictError) {
    statusCode = HTTP_STATUS.CONFLICT;
    message = err.message;
  }

  res.status(statusCode).json({ error: message });
};
