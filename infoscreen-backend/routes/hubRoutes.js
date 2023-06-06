const express = require('express');
const hubController = require('../controllers/hubController');
const router = express.Router();

router.get('/hub/:id/profile', hubController.getUserProfile);

module.exports = router;
