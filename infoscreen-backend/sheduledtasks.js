const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const resetLeaderboard = async () => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, './users.json'));
    const users = JSON.parse(data);

    for (let user of users) {
      user.coffee = 0;
      user.soda = 0;
    }

    fs.writeFileSync(path.resolve(__dirname, './users.json'), JSON.stringify(users));
    console.log('Successfully reset leaderboard');
  } catch (error) {
    console.error('Error resetting leaderboard:', error);
  }
};

// Schedule the task
const scheduleResetLeaderboard = () => {
  cron.schedule('0 0 * * *', resetLeaderboard);
};

module.exports = {
    scheduleResetLeaderboard,
};
