const express = require('express');
const kaizenController = require('../controllers/kaizenController');
const router = express.Router();

router.get('/getTasks', kaizenController.getExsistingTasks);
router.post('/createTask', kaizenController.createNewTask);
router.put('/updateTask/:id', kaizenController.updateTask);
router.post('/addComment/:id', kaizenController.addComment);
router.put('/editComment/:taskId/:commentId', kaizenController.editComment);
router.delete('/deleteComment/:taskId/:commentId', kaizenController.deleteComment);


module.exports = router;