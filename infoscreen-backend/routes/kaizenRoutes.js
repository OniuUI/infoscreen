const express = require('express');
const kaizenController = require('../controllers/kaizenController');
const router = express.Router();

router.get('/getTasks', kaizenController.getExsistingTasks);
router.get('/tasks/:id', kaizenController.getTaskById);
router.post('/createTask', kaizenController.createNewTask);
router.put('/updateTask/:id', kaizenController.updateTask);
router.post('/addComment/:id', kaizenController.addComment);
router.put('/editComment/:taskId/:commentId', kaizenController.editComment);
router.delete('/deleteComment/:taskId/:commentId', kaizenController.deleteComment);
router.delete('/deleteTask/:id', kaizenController.deleteTask);


module.exports = router;