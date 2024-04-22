const express = require('express');
const accessController = require('../controllers/accessController');
const router = express.Router();


router.get('/managers', accessController.getManagersAndAdmins);


module.exports = router;
