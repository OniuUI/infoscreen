const express = require("express");
const cors = require("cors");
const { scheduleResetLeaderboard } = require('./sheduledtasks');

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const rssRoutes = require('./routes/rssRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Server startup events.
scheduleResetLeaderboard();

app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/rss', rssRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
