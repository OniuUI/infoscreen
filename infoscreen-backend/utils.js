// event-utils.js
const fs = require('fs');
const path = require('path');

const eventsFilePath = path.join(__dirname, 'events.json');

const removePastEvents = () => {
  fs.readFile(eventsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Unable to read event data:', err);
      return;
    }

    const eventsData = JSON.parse(data);
    const currentDate = new Date();
    const filteredEvents = eventsData.events.filter((event) => {
      const eventDate = new Date(event.eventDate);
      return eventDate >= currentDate;
    });

    eventsData.events = filteredEvents;

    fs.writeFile(eventsFilePath, JSON.stringify(eventsData), (err) => {
      if (err) {
        console.error('Unable to save updated event data:', err);
      }
    });
  });
};

module.exports = {
    removePastEvents,
};
