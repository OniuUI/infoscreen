const { getDb } = require('../db');

exports.getOrgComponents = async (req, res) => {
    try {
        const db = getDb();
        const userId = req.params.id;
        const component = await db.collection('componentStructures').find().toArray();

        res.send(component);
    } catch (err) {
        res.status(500).send({ error: "Unable to fetch component structure data." });
    }
};

exports.getAvailableSystemComponents = async (req, res) => {
    try {
        const db = getDb();
        const components = await db.collection('availableComponents').find().toArray();
        //console.log(components)
        res.send(components);
    } catch (err) {
        res.status(500).send({ error: "Unable to fetch available system components." });
    }

}

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
        const component = {
            ...req.body,
            active: req.body.active || false,
        };
        const result = await db.collection('componentStructures').updateOne(
            { id: component.id }, // filter
            { $set: component }, // update
            { upsert: true } // options
        );
        console.log(`Component structure saved with ID: ${component.id}`);
        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: "Unable to save component structure data."});
    }
};

