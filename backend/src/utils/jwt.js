import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { JwtError } from './errors.js';

export const generateAccessToken = (userId) => {
  try {
    return jwt.sign(
      { userId, type: 'access' },
      env.jwt.accessSecret,
      { expiresIn: env.jwt.accessExpiry }
    );
  } catch (err) {
    throw new JwtError('Failed to generate access token');
  }
};

export const generateRefreshToken = (userId) => {
  try {
    return jwt.sign(
      { userId, type: 'refresh' },
      env.jwt.refreshSecret,
      { expiresIn: env.jwt.refreshExpiry }
    );
  } catch (err) {
    throw new JwtError('Failed to generate refresh token');
  }
};

export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, env.jwt.accessSecret);
    if (decoded.type !== 'access') {
      throw new JwtError('Invalid token type');
    }
    return decoded;
  } catch (err) {
    throw new JwtError(err.message);
  }
};

export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, env.jwt.refreshSecret);
    if (decoded.type !== 'refresh') {
      throw new JwtError('Invalid token type');
    }
    return decoded;
  } catch (err) {
    throw new JwtError(err.message);
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (err) {
    throw new JwtError('Failed to decode token');
  }
};
