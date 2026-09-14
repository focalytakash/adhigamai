const express = require('express');
const hackathonController = require('../controllers/hackathon.controller');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.post('/', upload.single('ppt'), hackathonController.createRegistration);

module.exports = router;
