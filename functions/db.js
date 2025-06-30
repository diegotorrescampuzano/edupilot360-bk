/* eslint-disable*/

// Import Firebase Functions config for environment variables
const functions = require('firebase-functions');
// Import Mongoose for MongoDB connection and schema modeling
const mongoose = require('mongoose');

// Get the MongoDB connection URI from environment variables or Firebase Functions config
// const MONGO_URI = functions.config().mongodb.uri || process.env.MONGO_URI;
// Run: firebase functions:config:set mongodb.uri=mongodb+srv://edupilot360-admin:123@cluster0.wmro3ey.mongodb.net
const MONGO_URI =  "mongodb+srv://edupilot360-admin:123@cluster0.wmro3ey.mongodb.net";
// TODO add this to .env

// Track the connection status to avoid reconnecting on every function call
let isConnected = false;

// Async function to establish a connection to MongoDB Atlas
async function connectToMongo() {
  // Only connect if not already connected
  if (!isConnected) {
    try {
      // Connect to MongoDB using the provided URI and options
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,      // Use the new MongoDB connection string parser
        useUnifiedTopology: true,   // Use the new server discovery and monitoring engine
        dbName: 'edupilot360'       // Force the use of the 'edupilot360' database
      });
      isConnected = true;
      console.log('Active DB:', mongoose.connection.name);           // Mark as connected to avoid reconnecting
      console.log('Conected to MongoDB Atlas');
    } catch (error) {
      // Log and rethrow any connection errors
      console.error('Error of conexion:', error);
      throw error;
    }
  }
}

// Export the connection function for use in other modules
module.exports = { connectToMongo };
