const fs = require('fs');
const path = require('path');
const { removePastEvents } = require('../utils');

const eventsFilePath = path.join(__dirname, "../data/events.json");

exports.getAllEvents = (req, res) => {
    removePastEvents();
    fs.readFile(eventsFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ error: "Unable to read event data." });
        }

        const events = JSON.parse(data);
        res.send(events);
    });
};

exports.addEvent = (req, res) => {
    const newEvent = req.body;

    fs.readFile(eventsFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ error: "Unable to read event data." });
        }

        const eventsData = JSON.parse(data);
        eventsData.events.push(newEvent);

        fs.writeFile(eventsFilePath, JSON.stringify(eventsData), (err) => {
            if (err) {
                return res.status(500).send({ error: "Unable to save event data." });
            }
            res.send({ success: true });
        });
    });
};

exports.updateEvent = (req, res) => {
    const updatedEvent = req.body;
    const eventId = req.params.id;

    fs.readFile(eventsFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ error: "Unable to read event data." });
        }

        const eventsData = JSON.parse(data);
        const eventIndex = eventsData.events.findIndex(event => event.id === eventId);

        if (eventIndex === -1) {
            return res.status(404).send({ error: 'Event not found.' });
        }

        // Update the event's data
        eventsData.events[eventIndex] = updatedEvent;

        fs.writeFile(eventsFilePath, JSON.stringify(eventsData), (err) => {
            if (err) {
                return res.status(500).send({ error: "Unable to save event data." });
            }
            res.send({ success: true });
        });
    });
};

exports.deleteEvent = (req, res) => {
    const eventId = req.params.id;

    fs.readFile(eventsFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ error: "Unable to read event data." });
        }

        const eventsData = JSON.parse(data);
        const eventIndex = eventsData.events.findIndex(event => event.id === eventId);

        if (eventIndex === -1) {
            return res.status(404).send({ error: 'Event not found.' });
        }

        // Remove the event from the array
        eventsData.events.splice(eventIndex, 1);

        fs.writeFile(eventsFilePath, JSON.stringify(eventsData), (err) => {
            if (err) {
                return res.status(500).send({ error: "Unable to save event data." });
            }
            res.send({ success: true });
        });
    });
};
