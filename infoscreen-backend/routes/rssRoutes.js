const express = require('express');
const RSSParser = require('rss-parser');
const rssController = require('../controllers/rssController');

const router = express.Router();

router.get('/', rssController.getRSSFeed);

module.exports = router;
