const express = require('express');
const fs = require('fs');
const path = require('path');
const eventController = require('../controllers/eventController');
const { removePastEvents } = require('../utils');

const router = express.Router();

// Update before every event request
router.use((req, res, next) => {
    removePastEvents();
    next();
});

router.get('/', eventController.getAllEvents);
router.post('/', eventController.addEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
