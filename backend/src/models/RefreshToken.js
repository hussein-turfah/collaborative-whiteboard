import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database.js';
import { generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { AuthenticationError } from '../utils/errors.js';

const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'refresh_tokens',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] }
  ]
});

RefreshToken.generate = async function(userId) {
  const token = generateRefreshToken(userId);

  const decoded = verifyRefreshToken(token);
  const expiresAt = new Date(decoded.exp * 1000);

  await this.create({
    user_id: userId,
    token,
    expires_at: expiresAt
  });

  return token;
};

RefreshToken.verify = async function(token) {
  const refreshToken = await this.findOne({ where: { token } });

  if (!refreshToken) {
    return false;
  }

  if (new Date() > refreshToken.expires_at) {
    await refreshToken.destroy();
    return false;
  }

  try {
    verifyRefreshToken(token);
    return true;
  } catch (err) {
    return false;
  }
};

RefreshToken.revoke = async function(token) {
  await this.destroy({ where: { token } });
};

export default RefreshToken;
