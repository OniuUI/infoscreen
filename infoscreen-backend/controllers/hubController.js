const { getDb } = require('../db');

exports.getUserProfile = async (req, res) => {
    try {
        const db = getDb();
        const userId = req.params.id;
        const user = await db.collection('users').findOne({ _id: userId });

        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }
        const { password, ...userWithoutPassword } = user;
        res.send({ user: userWithoutPassword });
    } catch (err) {
        res.status(500).send({ error: "Unable to fetch user profile data." });
    }
};

exports.saveUserPreferences = async (req, res) => {
    try {
        const db = getDb();
        const userId = req.params.id;
        const {gridLength, gridComponents} = req.body;

        await db.collection('userPreferences').updateOne(
            { _id: userId },
            { $set: { gridLength, gridComponents } },
            { upsert: true }
        );

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send({ error: "Unable to save user preferences." });
    }
};

exports.getUserPreferences = async (req, res) => {
    try {
        const db = getDb();
        const userId = req.params.id;

        const preferences = await db.collection('userPreferences').findOne({ _id: userId });

        if (!preferences) {
            res.send({gridLength: 2, gridComponents: []});  // default preferences
        } else {
            const {gridLength, gridComponents} = preferences;
            res.send({gridLength, gridComponents});
        }
    } catch (err) {
        res.status(500).send({ error: "Unable to fetch user preferences." });
    }
};
