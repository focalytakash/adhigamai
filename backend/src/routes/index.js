const express = require('express');
const healthRoutes = require('./health.routes');
const userRoutes = require('./user.routes');
const hackathonRoutes = require('./hackathon.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/hackathon', hackathonRoutes);

module.exports = router;
