/* eslint-disable */

// Import Mongoose for schema and model creation
const mongoose = require('mongoose');
// Extract the Schema constructor from Mongoose
const { Schema } = mongoose;

// Define the user schema with required fields and validation
const userSchema = new Schema({
  // Unique Firebase Authentication UID for the user
  firebaseUid: { type: String, required: true, unique: true },
  // Full name of the user
  name: { type: String, required: true },
  // Email address, must be unique in the collection
  email: { type: String, required: true, unique: true },
  // Phone number of the user
  phone: { type: String, required: true },
  // Physical address of the user
  address: { type: String, required: true },
  // Status of the user, must be 'active' or 'inactive', defaults to 'active'
  status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
  // Timestamp for when the user was created
  createdAt: { type: Date, default: Date.now },
  // Timestamp for when the user was last updated
  updatedAt: { type: Date, default: Date.now }
});

// Export the User model, which uses the 'users' collection in MongoDB
module.exports = mongoose.model('User', userSchema);
