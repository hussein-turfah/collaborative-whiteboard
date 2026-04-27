export const JWT_EXPIRY = {
  ACCESS: '15m',
  REFRESH: '7d'
};

export const BCRYPT_ROUNDS = 10;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

export const ERROR_MESSAGES = {
  VALIDATION_FAILED: 'Validation failed',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not found',
  CONFLICT: 'Resource already exists',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_TOKEN: 'Invalid token',
  USER_NOT_FOUND: 'User not found',
  CANVAS_NOT_FOUND: 'Canvas not found',
  STROKE_NOT_FOUND: 'Stroke not found',
  EMAIL_TAKEN: 'Email already in use',
  USERNAME_TAKEN: 'Username already taken'
};
