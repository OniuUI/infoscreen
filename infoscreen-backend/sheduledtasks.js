const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const resetLeaderboard = async () => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, './data/users.json'));
    const jsonData = JSON.parse(data);
    const users = jsonData.users; // Access the 'users' property of the object

    for (let user of users) {
      user.coffee = 0;
      user.soda = 0;
    }

    // Write the updated data back to the file
    fs.writeFileSync(path.resolve(__dirname, './data/users.json'), JSON.stringify(jsonData, null, 2));
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
