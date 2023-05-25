const getDb = require('./db').getDb;
const debug = process.env.DEBUG || false;

const removePastEvents = async () => {
    try {
        const db = getDb();
        const currentDate = new Date();
        const result = await db.collection('events').deleteMany({ eventDate: { $lt: currentDate } });
    if(debug){
        //console.log(result.deletedCount + " events were removed");
    }
    } catch (err) {
        console.error('Unable to remove past events:', err);
    }
};

module.exports = {
  removePastEvents,
};
