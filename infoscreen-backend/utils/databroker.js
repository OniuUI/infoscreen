const {getDb} = require("../db");

class DataBroker {
    async getUsers(query = {}) {
        const db = getDb();
        // Fetch data from the 'users' collection
        const users = await db.collection('users').find(query).toArray();
        return users;
    }
}

module.exports = DataBroker;