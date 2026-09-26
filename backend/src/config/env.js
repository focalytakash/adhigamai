require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 8080,
  mongoUri: process.env.MONGODB_URI,
  corsOrigin: process.env.CORS_ORIGIN,
  bucketUrl: process.env.BUCKET_URL || '',
  googleSheetId: process.env.GOOGLE_SHEET_ID || '',
  googleSheetTab: process.env.GOOGLE_SHEET_TAB || '',
  googleServiceAccountPath: process.env.GOOGLE_SERVICE_ACCOUNT_PATH || '',
};

module.exports = env;
