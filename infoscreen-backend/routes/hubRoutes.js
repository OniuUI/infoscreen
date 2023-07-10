const express = require('express');
const hubController = require('../controllers/hubController');
const router = express.Router();

router.get('/:id/profile', hubController.getUserProfile);
router.post('/:id/preferences', hubController.saveUserPreferences);
router.get('/:id/preferences', hubController.getUserPreferences);

module.exports = router;
