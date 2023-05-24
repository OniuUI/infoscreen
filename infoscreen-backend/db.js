const { MongoClient } = require('mongodb');
const debug = process.env.DEBUG || false;


let _db;

async function testConnection(db) {
    try {
        if (true) {
            // fetch the server info
            const serverInfo = await db.command({ serverStatus: 1 });

            console.log("Connection and server information:");
            console.log("Host: " + serverInfo.host);
            console.log("Port: " + serverInfo.port);
            console.log("Version: " + serverInfo.version);
            console.log("Process: " + serverInfo.process);
            console.log("Uptime (in milliseconds): " + serverInfo.uptime);
            console.log("Uptime (in human readable format): " + serverInfo.uptimeEstimate);
            console.log("Database: " + db.databaseName);

            // List all collections
            const collections = await db.listCollections().toArray();
            console.log("Collections in this database are:");
            collections.forEach((collection) => console.log(collection.name));
        }
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        throw err;
    }
}

const connectToDb = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    _db = client.db(process.env.MONGO_DB);
    testConnection(_db)
      .then(() => {
          console.log('Connected to MongoDB');
      });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
};

const getDb = () => {
  if (!_db) {
    throw Error('Database not initialized. Call connectToDb first.');
  }
  return _db;
};

module.exports = {
  connectToDb,
  getDb,
};
