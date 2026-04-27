import { DataTypes } from 'sequelize';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database.js';
import { BCRYPT_ROUNDS } from '../config/constants.js';
import { AuthenticationError, ConflictError } from '../utils/errors.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        user.password = await bcryptjs.hash(user.password, BCRYPT_ROUNDS);
      }
    }
  }
});

User.prototype.validatePassword = async function(plainPassword) {
  return bcryptjs.compare(plainPassword, this.password);
};

User.prototype.toJSON = function() {
  const { password, ...userWithoutPassword } = this.dataValues;
  return userWithoutPassword;
};

User.register = async function(username, email, password) {
  const existingEmail = await this.findOne({ where: { email } });
  if (existingEmail) {
    throw new ConflictError('Email already in use');
  }

  const existingUsername = await this.findOne({ where: { username } });
  if (existingUsername) {
    throw new ConflictError('Username already taken');
  }

  return this.create({ username, email, password });
};

User.login = async function(email, password) {
  const user = await this.findOne({ where: { email } });
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  const isValid = await user.validatePassword(password);
  if (!isValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  return user;
};

User.findByEmail = async function(email) {
  return this.findOne({ where: { email } });
};

User.findById = async function(id) {
  return this.findByPk(id);
};

export default User;
