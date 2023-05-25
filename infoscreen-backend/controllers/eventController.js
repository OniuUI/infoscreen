const getDb = require('../db').getDb;
const { removePastEvents } = require('../utils');

exports.getAllEvents = async (req, res) => {
    try {
        removePastEvents();
        const db = getDb();
        const events = await db.collection('events').find().toArray();
        res.send(events);
    } catch (err) {
        res.status(500).send({ error: "Unable to read event data."});
    }
};

exports.addEvent = async (req, res) => {
    try {
        const db = getDb();
        const newEvent = req.body;
        const result = await db.collection('events').insertOne(newEvent);
        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: "Unable to save event data."});
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const db = getDb();
        const eventId = req.params.id;
        const updatedEvent = req.body;
        const result = await db.collection('events').replaceOne({ _id: eventId }, updatedEvent);
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Event not found.' });
        }
        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: "Unable to update event data."});
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const db = getDb();
        const eventId = req.params.id;
        const result = await db.collection('events').deleteOne({ _id: eventId });
        if (result.deletedCount === 0) {
            return res.status(404).send({ error: 'Event not found.' });
        }
        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: "Unable to delete event data."});
    }
};
