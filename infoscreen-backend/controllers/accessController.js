const { getDb } = require('../db');

exports.getManagersAndAdmins = async (req, res) => {
    try {
        const db = getDb();
        const roles = await db.collection('roles').find({ role: { $in: ['admin', 'manager'] } }).toArray();
        console.log(roles);
        const userIds = roles.map(role => role.userId);
        console.log(userIds);
        const users = await db.collection('users').find({ _id: { $in: userIds } }).toArray();
        console.log(users);
        res.send({ users });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Unable to fetch users." });
    }
};