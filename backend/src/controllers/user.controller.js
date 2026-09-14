
const asyncHandler = require('../middleware/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const AppError = require('../utils/appError');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  return apiResponse.success(res, { message: 'Users fetched', data: users });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return apiResponse.success(res, { message: 'User fetched', data: user });
});

const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  return apiResponse.success(res, {
    status: 201,
    message: 'User created',
    data: user,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return apiResponse.success(res, { message: 'User updated', data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return apiResponse.success(res, { message: 'User deleted', data: user });
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
