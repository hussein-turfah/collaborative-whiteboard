import sequelize from './src/config/database.js';
import env from './src/config/env.js';
import app from './src/app.js';
import User from './src/models/User.js';
import Canvas from './src/models/Canvas.js';
import Stroke from './src/models/Stroke.js';
import RefreshToken from './src/models/RefreshToken.js';

Canvas.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
Canvas.hasMany(Stroke, { foreignKey: 'canvas_id' });

Stroke.belongsTo(Canvas, { foreignKey: 'canvas_id' });
Stroke.belongsTo(User, { foreignKey: 'user_id' });

RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

const startServer = async () => {
  try {
    console.log('[Database] Connecting...');
    await sequelize.authenticate();
    console.log('[Database] Connected successfully');

    console.log('[Database] Syncing models...');
    await sequelize.sync({ alter: env.nodeEnv === 'development' });
    console.log('[Database] Models synced');

    const port = env.port;
    app.listen(port, () => {
      console.log(`[Server] Running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('[Error] Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
