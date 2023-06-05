const { getDb } = require('../db');
const debug = process.env.DEBUG || false;
const bcrypt = require('bcrypt');



exports.getAllUsers = async (req, res) => {
    try {
        const db = getDb();
        const users = await db.collection('users').find().toArray();
        res.send({ users: users });
    } catch (err) {
        res.status(500).send({ error: "Unable to read user data."});
    }
};

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
        const db = getDb();
        const user = await db.collection('users').findOne({ _id: id });

        if (!user) {
            throw new Error('User not found.');
        }

        return user;
    } catch (err) {
        throw new Error('Unable to fetch user data.');
    }
};


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


