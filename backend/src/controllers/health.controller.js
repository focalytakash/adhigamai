const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const apiResponse = require('../utils/apiResponse');

const getHealth = asyncHandler(async (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  return apiResponse.success(res, {
    message: 'OK',
    data: {
      status: 'healthy',
      database: dbState,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = { getHealth };
