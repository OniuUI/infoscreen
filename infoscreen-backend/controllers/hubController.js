// controllers/hubController.js

const { getDb } = require('../db');

exports.getUserProfile = async (req, res) => {
    try {
        const db = getDb();
        const userId = req.params.id;
        const user = await db.collection('users').findOne({ _id: userId });

        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }
        // You can exclude sensitive data like password from the response
        const { password, ...userWithoutPassword } = user;
        res.send({ user: userWithoutPassword });
    } catch (err) {
        res.status(500).send({ error: "Unable to fetch user profile data." });
    }
};
