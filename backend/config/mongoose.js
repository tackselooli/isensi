const mongoose = require('mongoose');

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/sajad-app-db";

  try {
    await mongoose.connect(uri);  // No need for `useNewUrlParser` or `useUnifiedTopology`
    console.log("Connected successfully to MongoDB via Mongoose!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };
