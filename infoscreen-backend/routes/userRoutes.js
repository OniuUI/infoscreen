const express = require('express');
const fs = require('fs');
const path = require('path');
const userController = require('../controllers/userController');

const router = express.Router();

//const usersFilePath = path.join(__dirname, "users.json");

router.get('/', userController.getAllUsers);
router.post('/', userController.addUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:userId/drinks', userController.updateDrinks);
router.put('/:id/coffee-soda', userController.updateCoffeeSoda);

module.exports = router;
