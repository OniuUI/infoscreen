const getDb = require('./db').getDb;
const debug = process.env.DEBUG || false;

const removePastEvents = async () => {
    try {
        const db = getDb();

        // Get the current date and set the time to 00:00:00.
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Get all events
        const events = await db.collection('events').find({}).toArray();

        // Filter out IDs of events that are in the past
        const pastEventIds = events
            .filter(event => new Date(event.eventDate) < currentDate)
            .map(event => event._id);

        if (pastEventIds.length > 0) {
            // Remove past events
            const result = await db.collection('events').deleteMany({ _id: { $in: pastEventIds } });

            if(debug){
                console.log(result.deletedCount + " events were removed");
            }
        }
    } catch (err) {
        console.error('Unable to remove past events:', err);
    }
};


module.exports = {
  removePastEvents,
};
