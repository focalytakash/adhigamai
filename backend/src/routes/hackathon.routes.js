const express = require('express');
const hackathonController = require('../controllers/hackathon.controller');

const router = express.Router();

router.get('/', hackathonController.listRegistrations);
router.post('/', hackathonController.createRegistration);
router.post('/query', hackathonController.createQuery);

module.exports = router;
