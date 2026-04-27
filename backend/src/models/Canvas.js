import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database.js';

const Canvas = sequelize.define('Canvas', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'canvases',
  timestamps: true,
  underscored: true
});

Canvas.prototype.toJSON = function() {
  return {
    id: this.id,
    name: this.name,
    created_by: this.created_by,
    creator: this.creator ? {
      username: this.creator.username,
      email: this.creator.email
    } : undefined,
    created_at: this.created_at,
    updated_at: this.updated_at
  };
};

Canvas.createCanvas = async function(name, userId) {
  return this.create({ name, created_by: userId });
};

Canvas.findById = async function(id) {
  const canvas = await this.findByPk(id, {
    include: [{
      association: 'creator',
      attributes: ['username', 'email']
    }]
  });
  return canvas;
};

Canvas.findByUser = async function(userId) {
  return this.findAll({
    where: { created_by: userId },
    order: [['created_at', 'DESC']],
    include: [{
      association: 'creator',
      attributes: ['username', 'email']
    }]
  });
};

Canvas.getCanvasWithStrokes = async function(id) {
  return this.findByPk(id, {
    include: [
      {
        association: 'creator',
        attributes: ['id', 'username', 'email']
      },
      {
        association: 'strokes',
        where: { deleted_at: null },
        required: false,
        order: [['stroke_order', 'ASC']]
      }
    ]
  });
};

export default Canvas;
