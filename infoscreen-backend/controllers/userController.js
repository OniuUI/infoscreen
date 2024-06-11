const { getDb } = require('../db');
const debug = process.env.DEBUG || false;
const bcrypt = require('bcrypt');


/**
 * @openapi
 * /api/users:
 *   get:
 *      tags:
 *        - User
 *   description: Returns a list of all users
 *   responses:
 *     200:
 *       description: A list of users.
 *     500:
 *       description: Unable to read user data.
 */
exports.getAllUsers = async (req, res) => {
    try {
        const db = getDb();
        const users = await db.collection('users').find().toArray();
        res.send({ users: users });
    } catch (err) {
        res.status(500).send({ error: "Unable to read user data."});
    }
};

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *      tags:
 *        - User
 *   description: Returns a specific user
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: ID of the user to retrieve
 *       schema:
 *         type: string
 *   responses:
 *     200:
 *       description: User data.
 *     404:
 *       description: User not found.
 *     500:
 *       description: Unable to fetch user data.
 */
exports.getUser = async (req, res) => {
    try {
        const db = getDb();
        const userId = req.params.id;
        const user = await db.collection('users').findOne({ _id: userId });

        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }
        res.send({ user });
    } catch (err) {
        res.status(500).send({ error: "Unable to fetch user data." });
    }
};

exports.getUserByEmail = async (email) => {
    const db = getDb();
    return await db.collection('users').findOne({ email: email });
};

/**
 * @openapi
 * /api/users:
 *   post:
 *      tags:
 *        - User
 *   description: Adds a new user
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *   responses:
 *     200:
 *       description: User added successfully.
 *     500:
 *       description: Unable to save user data.
 */
exports.addUser = async (req, res) => {
  try {
    const db = getDb();
    const newUser = req.body;

    // Hash the password before storing
    newUser.password = await bcrypt.hash(newUser.password, 10);

    await db.collection('users').insertOne(newUser);
    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: "Unable to save user data." });
  }
};

exports.getUserById = async (id) => {
    try {
        console.log('id', id)
        const db = getDb();
        const user = await db.collection('users').findOne({ _id: id });
        console.log('user', user)
        if (!user) {
            throw new Error('User not found.');
        }

        return user;
    } catch (err) {
        throw new Error('Unable to fetch user data.');
    }
};

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *      tags:
 *        - User
 *   description: Updates a specific user
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: ID of the user to update
 *       schema:
 *         type: string
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *   responses:
 *     200:
 *       description: User updated successfully.
 *     404:
 *       description: User not found.
 *     500:
 *       description: Unable to update user data.
 */
exports.updateUser = async (req, res) => {
  try {
    const db = getDb();
    const updatedUser = req.body;
    const userId = req.params.id;

    if (updatedUser.password) {
      // Hash the new password before storing
      updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
    }

    const result = await db.collection('users').replaceOne({ _id: userId }, updatedUser);

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: 'User not found.' });
    }
    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: "Unable to update user data." });
  }
};

exports.updateUserById = async (userId, updatedUser) => {
    try {
        const db = getDb();

        const result = await db.collection('users').replaceOne({ _id: userId }, updatedUser);

        if (result.matchedCount === 0) {
            throw new Error('User not found.');
        }
        return result;
    } catch (err) {
        throw new Error('Unable to update user data.');
    }
};

/**
 * @openapi
 * /api/users/{id}/image:
 *   get:
 *      tags:
 *        - User
 *   description: Returns the image of a specific user
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: ID of the user to retrieve the image for
 *       schema:
 *         type: string
 *   responses:
 *     200:
 *       description: User image.
 *     404:
 *       description: User not found.
 *     500:
 *       description: Unable to fetch user image.
 */
exports.getImageByUserId = async (req, res) => {
    try {
        const db = getDb();
        const userId = req.params.id;
        const user = await db.collection('users').findOne({ _id: userId });

        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }

        // Assuming the user object has an 'imageUrl' property
        res.send({ imageUrl: user.imageUrl });
    } catch (err) {
        res.status(500).send({ error: "Unable to fetch user image." });
    }
};


/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *      tags:
 *        - User
 *   description: Deletes a specific user
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: ID of the user to delete
 *       schema:
 *         type: string
 *   responses:
 *     200:
 *       description: User deleted successfully.
 *     404:
 *       description: User not found.
 *     500:
 *       description: Unable to delete user data.
 */
exports.deleteUser = async (req, res) => {
    try {
        const db = getDb();
        const userId = req.params.id;
        const result = await db.collection('users').deleteOne({ _id: userId });

        if (result.deletedCount === 0) {
            return res.status(404).send({ error: 'User not found.' });
        }
        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: "Unable to delete user data." });
    }
};

/**
 * @openapi
 * /api/users/{id}/drinks:
 *   put:
 *      tags:
 *        - User
 *   description: Updates a user's drink preferences
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: ID of the user to update
 *       schema:
 *         type: string
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             coffees:
 *               type: number
 *             sodas:
 *               type: number
 *   responses:
 *     200:
 *       description: User's drink preferences updated successfully.
 *     404:
 *       description: User not found.
 *     500:
 *       description: Unable to update user data.
 */
exports.updateDrinks = async (req, res) => {
    try {
        const db = getDb();
        const userId = req.params.id;
        const { coffees, sodas } = req.body;
        const result = await db.collection('users').updateOne(
            { _id: userId },
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

/**
 * @openapi
 * /api/users/{id}/coffee-soda:
 *   put:
 *      tags:
 *        - User
 *   description: Updates a user's coffee and soda preferences
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: ID of the user to update
 *       schema:
 *         type: string
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             coffee:
 *               type: boolean
 *             soda:
 *               type: boolean
 *   responses:
 *     200:
 *       description: User's coffee and soda preferences updated successfully.
 *     404:
 *       description: User not found.
 *     500:
 *       description: Unable to update user data.
 */
exports.updateCoffeeSoda = async (req, res) => {
    try {
        const db = getDb();
        const userId = req.params.id;
        const { coffee, soda } = req.body;
        const result = await db.collection('users').updateOne(
            { _id: userId },
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


