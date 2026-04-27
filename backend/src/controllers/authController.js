import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { generateAccessToken } from '../utils/jwt.js';
import { AuthenticationError } from '../utils/errors.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.validatedBody;

    const user = await User.register(username, email, password);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await RefreshToken.generate(user.id);

    res.status(201).json({
      accessToken,
      refreshToken,
      user: user.toJSON()
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;

    const user = await User.login(email, password);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await RefreshToken.generate(user.id);

    res.status(200).json({
      accessToken,
      refreshToken,
      user: user.toJSON()
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.validatedBody;

    const isValid = await RefreshToken.verify(refreshToken);
    if (!isValid) {
      throw new AuthenticationError('Invalid refresh token');
    }

    const rt = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!rt) {
      throw new AuthenticationError('Refresh token not found');
    }

    const accessToken = generateAccessToken(rt.user_id);
    const user = await User.findById(rt.user_id);

    res.status(200).json({
      accessToken,
      user: user.toJSON()
    });
  } catch (err) {
    next(err);
  }
};
