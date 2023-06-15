const express = require('express');
const rssController = require('../controllers/rssController');

const router = express.Router();

router.get('/', rssController.distributeRSSFeeds); // Get all parsed RSS feeds
router.get('/feeds', rssController.getRSSFeeds); // Get all feed entries in MongoDB
router.post('/add-feed', rssController.addFeed); // Add a new feed
router.delete('/:id', rssController.deleteFeed); // Delete a feed by ID

module.exports = router;
