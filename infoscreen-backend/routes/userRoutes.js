const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.post('/', userController.addUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:userId/drinks', userController.updateDrinks);
router.put('/:id/coffee-soda', userController.updateCoffeeSoda);
router.get('/:id/image', userController.getImageByUserId);

module.exports = router;