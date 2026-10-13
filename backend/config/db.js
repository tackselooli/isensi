const { MongoClient } = require('mongodb');

let client;

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB!");
    return client.db("sajad-app-db");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

module.exports = { connectToDatabase, client };