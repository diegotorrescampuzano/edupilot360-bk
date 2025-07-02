/* eslint-disable*/

// Import Firebase Functions config for environment variables
const functions = require('firebase-functions');
// Import Mongoose for MongoDB connection and schema modeling
const mongoose = require('mongoose');
// Import Firebase Functions logger for structured logging
const logger = require('firebase-functions/logger');

// Get the MongoDB connection URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

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
      logger.info('Active DB', { dbName: mongoose.connection.name });
      logger.info('Connected to MongoDB Atlas');
    } catch (error) {
      // Log and rethrow any connection errors
      logger.error('MongoDB connection error', { error: error.message });
      throw error;
    }
  }
}

// Export the connection function for use in other modules
module.exports = { connectToMongo };
