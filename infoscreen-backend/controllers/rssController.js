const RSSParser = require('rss-parser');
const getDb = require('../db').getDb;
const parser = new RSSParser();

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

exports.distributeRSSFeeds = async (req, res) => {
  try {
    const db = getDb();
    const feeds = await db.collection('feeds').find().toArray();

    const feedRequests = feeds.map(feed => parser.parseURL(feed.url)
      .then(parsedFeed => {
          return parsedFeed.items.map(item => ({
              ...item,
              color: feed.color,
              categories: Array.isArray(item.categories) ? item.categories : []
          }));
      })
    );

    const feedResults = await Promise.all(feedRequests);

    const mergedFeeds = [].concat(...feedResults);

    shuffleArray(mergedFeeds);
    res.json(mergedFeeds);
  } catch (err) {
    console.error('Unable to fetch feeds:', err);
    res.status(500).json({ error: "Unable to fetch feeds." });
  }
};

// Controller for fetching all RSS feeds
exports.getRSSFeeds = async (req, res) => {
    try {
        const db = getDb();
        const feeds = await db.collection('feeds').find().toArray();

        // Return the feeds to the frontend
        res.json(feeds);
    } catch (err) {
        console.error('Unable to fetch feeds:', err);
        res.status(500).json({ error: "Unable to fetch feeds." });
    }
};

// Controller for adding a new RSS feed
exports.addFeed = async (req, res) => {
    const { name, url, color } = req.body;

    // Validation to ensure all necessary data is present
    if (!name || !url || !color) {
        return res.status(400).json({ error: "Missing required feed data." });
    }

    try {
        const db = getDb();
        const feed = { name, url, color };

        await db.collection('feeds').insertOne(feed);

        res.status(201).json({ message: "Feed successfully added." });
    } catch (err) {
        console.error('Unable to add feed:', err);
        res.status(500).json({ error: "Unable to add feed." });
    }
};

// Controller for deleting a feed
exports.deleteFeed = async (req, res) => {
    const { id } = req.params; // Get the feed ID from the URL parameters

    try {
        const db = getDb();
        const { ObjectId } = require('mongodb');
        await db.collection('feeds').deleteOne({ _id: new ObjectId(id) });
        

        res.status(200).json({ message: "Feed successfully deleted." });
    } catch (err) {
        console.error('Unable to delete feed:', err);
        res.status(500).json({ error: "Unable to delete feed." });
    }
};


