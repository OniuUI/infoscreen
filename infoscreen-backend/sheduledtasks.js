const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const getDb = require('../db').getDb;

const resetLeaderboard = async () => {
  try {
    const db = getDb();

    const result = await db.collection('users').updateMany(
      {},
      {
        $set: {
          coffee: 0,
          soda: 0
        }
      }
    );

    console.log(`Successfully reset leaderboard for ${result.modifiedCount} users`);
  } catch (error) {
    console.error('Error resetting leaderboard:', error);
  }
};

const storePastLeaderboard = async () => {
  try {
    const db = getDb();

    // Get current leaderboard
    const currentLeaderboard = await db.collection('users').find().toArray();

    // Prepare data for thirstystats collection
    const statsData = currentLeaderboard.map(user => ({
      userId: user._id,
      coffee: user.coffee,
      soda: user.soda,
      timestamp: new Date()
    }));

    // Insert stats into thirstystats collection
    await db.collection('thirstystats').insertMany(statsData);

    console.log(`Successfully stored past leaderboard for ${currentLeaderboard.length} users`);
  } catch (error) {
    console.error('Error storing past leaderboard:', error);
  }
};

// Schedule the task
const scheduleResetLeaderboard = () => {
  cron.schedule('0 0 * * *', async () => {
    await storePastLeaderboard();
    await resetLeaderboard();
  });
};

module.exports = {
  scheduleResetLeaderboard,
};
