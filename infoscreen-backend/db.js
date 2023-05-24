const { MongoClient } = require('mongodb');
const debug = process.env.DEBUG || false;


let db = null;

async function connectToDb() {
    const uri = "mongodb://root:rootpassword@db:27017";
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
    await client.connect();
    console.log('Connected to MongoDB');

    db = client.db('infoscreen');

    // Only output detailed information if debug flag is true
    if (debug) {
      const admin = db.admin();

      // fetch the server info
      const serverInfo = await admin.serverStatus();

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
    // don't exit, just return an error
    throw err;
  }
}

function getDb() {
    if (!db) {
        console.error('DB not connected, call connectToDb first.');
    }
    return db;
}

module.exports = { connectToDb, getDb };
