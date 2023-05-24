const { getDb } = require('../db');
let db = getDb();



exports.getAllUsers = async (req, res) => {
    try {
        const users = await db.collection('users').find().toArray();
        res.send(users);
    } catch (err) {
        res.status(500).send({ error: "Unable to read user data." });
    }
};

exports.addUser = async (req, res) => {
    try {
        const newUser = req.body;
        await db.collection('users').insertOne(newUser);
        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: "Unable to save user data." });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = req.body;
        const userId = req.params.id;
        const result = await db.collection('users').replaceOne({ _id: ObjectID(userId) }, updatedUser);

        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'User not found.' });
        }
        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: "Unable to update user data." });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await db.collection('users').deleteOne({ _id: ObjectID(userId) });

        if (result.deletedCount === 0) {
            return res.status(404).send({ error: 'User not found.' });
        }
        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: "Unable to delete user data." });
    }
};

exports.updateDrinks = async (req, res) => {
    try {
        const userId = req.params.id;
        const { coffees, sodas } = req.body;
        const result = await db.collection('users').updateOne(
            { _id: ObjectID(userId) },
            { $set: { coffees: coffees, sodas: sodas } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'User not found.' });
        }
        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: "Unable to update user data." });
    }
};

exports.updateCoffeeSoda = async (req, res) => {
    try {
        const userId = req.params.id;
        const { coffee, soda } = req.body;
        const result = await db.collection('users').updateOne(
            { _id: ObjectID(userId) },
            { $set: { coffee: coffee, soda: soda } }
            );

        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'User not found.' });
        }
        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: "Unable to update user data." });
    }
};

