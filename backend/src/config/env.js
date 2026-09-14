require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 8080,
  mongoUri: process.env.MONGODB_URI,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  bucketUrl: process.env.BUCKET_URL || '',
};

module.exports = env;
