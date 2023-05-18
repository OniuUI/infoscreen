const RSSParser = require('rss-parser');

const parser = new RSSParser();

exports.getRSSFeed = async (req, res) => {
    const feed = await parser.parseURL('https://www.nrk.no/toppsaker.rss');
    res.json(feed);
};
