const { getDb } = require('../db');

exports.getManagersAndAdmins = async (req, res) => {
    try {
        const db = getDb();
        const roles = await db.collection('roles').find({ role: { $in: ['admin', 'manager'] } }).toArray();
        const userIds = roles.map(role => role.userId);
        const users = await db.collection('users').find({ _id: { $in: userIds } }).toArray();
        res.send({ users });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Unable to fetch users." });
    }
};

exports.getRoleByUserId = async (userId) => {
    try {
        const db = getDb();
        const roleDocument = await db.collection('roles').findOne({ userId: userId });

        if (!roleDocument) {
            throw new Error('No role found for this user');
        }

        return roleDocument.role;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.createRole = async (req, res) => {
    try {
        const db = getDb();
        let { userId, role } = req.body;

        // Convert userId to string
        userId = String(userId);

        // Validate the inputs
        if (!userId || !role) {
            return res.status(400).send({ error: "userId and role are required." });
        }

        // Update the role document or insert a new one if it doesn't exist
        await db.collection('roles').updateOne({ userId }, { $set: { role } }, { upsert: true });

        res.send({ success: true, message: 'Role created or updated successfully.' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Unable to create or update role." });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const db = getDb();
        let { userId, role } = req.body;

        // Convert userId to string
        userId = String(userId);

        // Validate the inputs
        if (!userId || !role) {
            return res.status(400).send({ error: "userId and role are required." });
        }

        // Update the role document or insert a new one if it doesn't exist
        await db.collection('roles').updateOne({ userId }, { $set: { role } }, { upsert: false });

        res.send({ success: true, message: 'Role updated successfully.' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Unable to update role." });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const db = getDb();
        const { userId } = req.params;

        // Validate the inputs
        if (!userId) {
            return res.status(400).send({ error: "userId is required." });
        }

        // Delete the role document
        await db.collection('roles').deleteOne({ userId });

        res.send({ success: true, message: 'Role deleted successfully.' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Unable to delete role." });
    }
};

/**
 * @openapi
 * /api/roles:
 *   get:
 *      tags:
 *        - Role
 *   description: Returns a list of all roles
 *   responses:
 *     200:
 *       description: A list of roles.
 *     500:
 *       description: Unable to read role data.
 */
exports.getAllRoles = async (req, res) => {
    try {
        const db = getDb();
        const roles = await db.collection('systemroles').find().toArray();
        res.send({ roles: roles });
    } catch (err) {
        res.status(500).send({ error: "Unable to read system role data."});
    }
};

