require('dotenv').config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require('path');
const { connectToDb, getDb } = require('./db');
const { scheduleResetLeaderboard } = require('./sheduledtasks');

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const rssRoutes = require('./routes/rssRoutes');



const app = express();


// Enable rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 800, // limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});

app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'data/images')));
app.use(express.json());

// Server startup events.
scheduleResetLeaderboard();

// Apply the rate limiter to all requests
app.use(limiter);



const PORT = process.env.PORT || 3001;
// Establish DB connection
connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Error while connecting to the database:', err);
})

// Middleware blocking for MongoDB
app.use(async (req, res, next) => {
  while (!getDb()) {
    // Wait until DB is connected
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  next();
});

app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/rss', rssRoutes);

