require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require('path');
const { connectToDb, getDb } = require('./db');
const { scheduleResetLeaderboard } = require('./sheduledtasks');
const  verifyAccessToken  = require('./security/validation')

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const galleryRouter = require('./routes/galleryRoutes');
const rssRoutes = require('./routes/rssRoutes');
const loginRoutes = require('./routes/loginRoutes');



const app = express();

// Body parser, sets maximum body payload limit to 50MB
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit:50000 }));


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




// Apply the rate limiter to all requests.
app.use(limiter);



const PORT = process.env.PORT || 3001;
// Establish DB connection
connectToDb()
  .then(() => {
    app.use('/api/users', verifyAccessToken, userRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error while connecting to the database:', err);
  });

// Middleware blocking for MongoDB
app.use(async (req, res, next) => {
  while (!getDb()) {
    // Wait until DB is connected
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  next();
});

// Unsecure routes
app.use('/api/login', loginRoutes);

//Secured paths
app.use('/api/events', verifyAccessToken, eventRoutes);
app.use('/api/rss', verifyAccessToken, rssRoutes);
app.use('/api/gallery', verifyAccessToken, galleryRouter);


