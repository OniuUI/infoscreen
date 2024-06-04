const {getDb} = require("../db");

class DataBroker {
    async getUsers(query = {}) {
        const db = getDb();
        // Fetch data from the 'users' collection
        const users = await db.collection('users').find(query).toArray();
        return users;
    }

    async getTasks(id = null) {
        const db = getDb();
        // Fetch data from the 'tasks' collection
        let tasks;
        if (id) {
            tasks = await db.collection('tasks').findOne({ id: id });
        } else {
            tasks = await db.collection('tasks').find().toArray();
        }
        return tasks;
    }
}

module.exports = DataBroker;