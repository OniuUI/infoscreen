const express = require('express');
const kaizenController = require('../controllers/kaizenController');
const router = express.Router();

// Task-related routes
router.get('/getTasks', kaizenController.getExsistingTasks);
router.get('/tasks/:id', kaizenController.getTaskById);
router.post('/createTask', kaizenController.createNewTask);
router.put('/updateTask/:id', kaizenController.updateTask);
router.post('/addComment/:id', kaizenController.addComment);
router.put('/editComment/:taskId/:commentId', kaizenController.editComment);
router.delete('/deleteComment/:taskId/:commentId', kaizenController.deleteComment);
router.delete('/deleteTask/:id', kaizenController.deleteTask);

// Category-related routes
router.post('/categories', kaizenController.createCategory);
router.get('/categories', kaizenController.fetchCategories);
router.put('/categories/:id', kaizenController.updateCategory);
router.delete('/categories/:id', kaizenController.deleteCategory);

module.exports = router;