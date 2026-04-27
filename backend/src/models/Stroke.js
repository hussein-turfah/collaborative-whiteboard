import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database.js';
import { AuthorizationError } from '../utils/errors.js';

const Stroke = sequelize.define('Stroke', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },
  canvas_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'canvases',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  points: {
    type: DataTypes.JSON,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  stroke_order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'strokes',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['canvas_id'] },
    { fields: ['user_id'] },
    { fields: ['created_at'] }
  ]
});

Stroke.prototype.toJSON = function() {
  return {
    id: this.id,
    user_id: this.user_id,
    canvas_id: this.canvas_id,
    points: this.points,
    color: this.color,
    size: this.size,
    created_at: this.created_at,
    deleted_at: this.deleted_at
  };
};

Stroke.createStroke = async function(canvasId, userId, pointsData, color, size) {
  const maxOrder = await this.max('stroke_order', {
    where: { canvas_id: canvasId }
  });

  const strokeOrder = (maxOrder ?? 0) + 1;

  return this.create({
    canvas_id: canvasId,
    user_id: userId,
    points: pointsData,
    color,
    size,
    stroke_order: strokeOrder
  });
};

Stroke.getCanvasStrokes = async function(canvasId) {
  return this.findAll({
    where: {
      canvas_id: canvasId,
      deleted_at: null
    },
    order: [['stroke_order', 'ASC']]
  });
};

Stroke.softDelete = async function(strokeId, userId) {
  const stroke = await this.findByPk(strokeId);
  if (!stroke) {
    throw new Error('Stroke not found');
  }

  if (stroke.user_id !== userId) {
    throw new AuthorizationError('Cannot delete stroke you did not create');
  }

  await stroke.update({ deleted_at: new Date() });
  return stroke;
};

Stroke.restore = async function(strokeId, userId) {
  const stroke = await this.findByPk(strokeId);
  if (!stroke) {
    throw new Error('Stroke not found');
  }

  if (stroke.user_id !== userId) {
    throw new AuthorizationError('Cannot restore stroke you did not create');
  }

  await stroke.update({ deleted_at: null });
  return stroke;
};

export default Stroke;
