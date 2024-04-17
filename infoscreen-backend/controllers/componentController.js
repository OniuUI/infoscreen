const { getDb } = require('../db');

exports.getOrgComponents = async (req, res) => {
    try {
        const db = getDb();
        const userId = req.params.id;
        const component = await db.collection('components').findOne({ _id: userId });

        if (!component) {
            return res.status(404).send({ error: 'Component structure not found.' });
        }

    } catch (err) {
        res.status(500).send({ error: "Unable to fetch component structure data." });
    }
};

exports.getKaizenBoard = async (req, res) => {
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

exports.getSelectedComponents = async (req, res) => {
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

exports.setComponentStructure = async (req, res) => {
    try {
        const db = getDb();
        const component = req.body;
        const result = await db.collection('components').insertOne(component);
        console.log(`Component structure saved with ID: ${result.insertedId}`);
        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: "Unable to save component structure data."});
    }
}