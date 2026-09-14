const success = (res, { status = 200, message = 'Success', data = null } = {}) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

const error = (res, { status = 500, message = 'Internal server error', errors = null } = {}) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};

module.exports = { success, error };
