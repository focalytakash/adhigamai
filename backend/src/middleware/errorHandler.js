const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = null;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((item) => item.message);
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field} already exists`;
  }

  if (err.name === 'MulterError' || err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = err.code === 'LIMIT_FILE_SIZE'
      ? 'PPT file is too large. Maximum size is 15MB.'
      : err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
