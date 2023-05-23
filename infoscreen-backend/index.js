const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require('path');
const { scheduleResetLeaderboard } = require('./sheduledtasks');

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const rssRoutes = require('./routes/rssRoutes');

const app = express();

// Enable rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});

app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'data/images')));
app.use(express.json());

// Server startup events.
scheduleResetLeaderboard();

// Apply the rate limiter to all requests
app.use(limiter);

app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/rss', rssRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
