import { Sequelize } from 'sequelize';
import env from './env.js';

let sequelize;

if (env.db.dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: env.db.storage,
    logging: env.nodeEnv === 'development' ? console.log : false
  });
} else if (env.db.dialect === 'mysql') {
  sequelize = new Sequelize(
    env.db.database,
    env.db.username,
    env.db.password,
    {
      host: env.db.host,
      port: env.db.port,
      dialect: 'mysql',
      logging: env.nodeEnv === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

export default sequelize;
