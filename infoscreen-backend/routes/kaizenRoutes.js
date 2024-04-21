const express = require('express');
const kaizenController = require('../controllers/kaizenController');
const router = express.Router();

router.get('/getTasks', kaizenController.getExsistingTasks);
router.post('/createTask', kaizenController.createNewTask);
router.put('/updateTask/:id', kaizenController.updateTask);

module.exports = router;