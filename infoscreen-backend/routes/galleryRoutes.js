const express = require('express');
const galleryController = require('../controllers/galleryController');

const router = express.Router();

router.get('/images', galleryController.getImages);

module.exports = router;
