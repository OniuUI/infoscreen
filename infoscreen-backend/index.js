require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require('path');
const { connectToDb, getDb } = require('./db');
const { scheduleResetLeaderboard } = require('./sheduledtasks');
const  verifyAccessToken  = require('./security/validation')

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger setup
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Infoscreen API',
            version: '1.0.0',
        },
    },
    // Path to the API docs
    apis: ['./routes/*.js', './controllers/*.js'],
};

const app = express();
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const galleryRouter = require('./routes/galleryRoutes');
const rssRoutes = require('./routes/rssRoutes');
const loginRoutes = require('./routes/loginRoutes');
const hubRoutes = require('./routes/hubRoutes');
const componentRoutes = require('./routes/componentRoutes');
const kaizenRoutes = require('./routes/kaizenRoutes');
const accessRoutes = require('./routes/accessRoutes');







// Body parser, sets maximum body payload limit to 50MB
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit:50000 }));


// Enable rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // limit each IP to 1000 requests per windowMs
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
app.use('/api/hub', verifyAccessToken, hubRoutes);
app.use('/api/events', verifyAccessToken, eventRoutes);
app.use('/api/rss', verifyAccessToken, rssRoutes);
app.use('/api/gallery', verifyAccessToken, galleryRouter);
app.use('/api/components', verifyAccessToken, componentRoutes);
app.use('/api/kaizen', verifyAccessToken, kaizenRoutes);
app.use('/api/access', verifyAccessToken, accessRoutes);


