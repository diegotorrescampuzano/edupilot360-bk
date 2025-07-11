/* eslint-disable */

// Import the database connection utility
const { connectToMongo } = require('../../../db');
// Import the User model
const User = require('../user.model');
// Import Firebase Functions logger for structured logging
const logger = require('firebase-functions/logger');

// Async function to handle user creation requests
module.exports = async (req, res) => {
  try {
    // Establish connection to MongoDB
    await connectToMongo();

    // Use Firebase UID from the verified token
    const firebaseUid = req.user.uid;

    // Validate required fields
    if (!firebaseUid || !req.body.email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Do NOT use firebaseUid for any other field except firebaseUid
    // All other fields come from req.body
    const newUser = new User({
      firebaseUid,                    // Only for firebaseUid field
      name: req.body.name,            // User's full name
      email: req.body.email,          // User's email (unique)
      phone: req.body.phone,          // User's phone number
      address: req.body.address,      // Physical address
      status: req.body.status || 'active' // Default to 'active' if not provided
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    logger.info('User created', { userId: savedUser._id, firebaseUid });
    // Respond with standard JSON API format
    res.status(201).json({ data: savedUser });
  } catch (error) {
    // Handle duplicate key errors (MongoDB error code 11000)
    if (error.code === 11000) {
      // Extract the duplicated field from the error object
      const duplicatedField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        error: `${duplicatedField} already exists in the database` 
      });
    }
    // Log and handle all other errors
    logger.error('User creation error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
