const express = require('express');
const loginController = require('../controllers/loginController');

const router = express.Router();

router.post('/', loginController.login);
router.post('/refreshToken', loginController.refreshToken);
module.exports = router;