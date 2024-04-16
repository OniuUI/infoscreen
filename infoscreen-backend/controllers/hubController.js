const { getDb } = require('../db');

/**
 * @openapi
 * /api/hub/{id}:
 *   get:
 *     tags:
 *       - Hub
 *     description: Returns a user profile
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Unable to fetch user profile data.
 */
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

/**
 * @openapi
 * /api/hub/{id}:
 *   put:
 *     tags:
 *       - Hub
 *     description: Saves user preferences
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gridLength:
 *                 type: number
 *               gridComponents:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: User preferences saved successfully.
 *       500:
 *         description: Unable to save user preferences.
 */
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

/**
 * @openapi
 * /api/hub/{id}:
 *   get:
 *     tags:
 *       - Hub
 *     description: Returns user preferences
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User preferences data.
 *       500:
 *         description: Unable to fetch user preferences.
 */
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
