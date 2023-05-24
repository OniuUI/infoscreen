// galleryRouter.js
const express = require('express');
const galleryController = require('../controllers/galleryController');

const router = express.Router();

router.get('/', galleryController.getImages);

module.exports = router;
