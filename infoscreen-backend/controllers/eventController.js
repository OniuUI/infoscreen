const getDb = require('../db').getDb;
const { removePastEvents } = require('../utils');

/**
 * @openapi
 * /api/events:
 *   get:
 *     tags:
 *         - Events
 *     description: Returns a list of all events
 *     responses:
 *       200:
 *         description: A list of events.
 *       500:
 *         description: Unable to read event data.
 */
exports.getAllEvents = async (req, res) => {
    try {
        await removePastEvents(); // Waits for past events to be wiped, on event load.
        const db = getDb();
        const events = await db.collection('events').find().toArray();
        res.send(events);
    } catch (err) {
        res.status(500).send({ error: "Unable to read event data."});
    }
};

/**
 * @openapi
 * /api/events:
 *   post:
 *     tags:
 *         - Events
 *     description: Adds a new event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Event added successfully.
 *       500:
 *         description: Unable to save event data.
 */
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

/**
 * @openapi
 * /api/events/{id}:
 *   put:
 *     tags:
 *        - Events
 *     description: Updates an existing event
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Event updated successfully.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Unable to update event data.
 */
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

/**
 * @openapi
 * /api/events/{id}:
 *   delete:
 *     tags:
 *       - Events
 *     description: Deletes an event
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Unable to delete event data.
 */
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