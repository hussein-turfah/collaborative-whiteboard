import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const required = [
  'PORT',
  'NODE_ENV',
  'DB_DIALECT',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRY',
  'JWT_REFRESH_EXPIRY'
];

const sqliteOnly = ['DB_STORAGE'];
const mysqlOnly = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

const missing = [];

for (const key of required) {
  if (!process.env[key]) {
    missing.push(key);
  }
}

if (process.env.DB_DIALECT === 'sqlite') {
  if (!process.env.DB_STORAGE) {
    missing.push('DB_STORAGE');
  }
} else if (process.env.DB_DIALECT === 'mysql') {
  for (const key of mysqlOnly) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
}

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export default {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  db: {
    dialect: process.env.DB_DIALECT,
    storage: process.env.DB_STORAGE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiry: process.env.JWT_ACCESS_EXPIRY,
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY
  }
};
