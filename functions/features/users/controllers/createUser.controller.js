/* eslint-disable */

// Import the database connection utility
const { connectToMongo } = require('../../../db');
// Import the User model
const User = require('../user.model');

// Async function to handle user creation requests
module.exports = async (req, res) => {
  try {
    // Establish connection to MongoDB
    await connectToMongo();
    
    // Validate required fields
    if (!req.body.firebaseUid || !req.body.email) {
      return res.status(400).json({ error: "firebaseUid and email are required" });
    }

    // Create a new User instance with request data
    const newUser = new User({
      firebaseUid: req.body.firebaseUid,  // Unique Firebase UID
      name: req.body.name,                 // User's full name
      email: req.body.email,               // User's email (unique)
      phone: req.body.phone,               // User's phone number
      address: req.body.address,           // Physical address
      status: req.body.status || 'active'  // Default to 'active' if not provided
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
    
    // Return the created user with 201 status
    res.status(201).json(savedUser);
  } catch (error) {
    // Handle duplicate key errors (MongoDB error code 11000)
    if (error.code === 11000) {
      // Extract the duplicated field from the error object
      const duplicatedField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        error: `${duplicatedField} already exists in the database` 
      });
    }
    // Handle all other errors with 500 status
    res.status(500).json({ error: error.message });
  }
};
