/* eslint-disable */
// Mongoose model for permissions collection

const mongoose = require('mongoose');
const { Schema } = mongoose;

const permissionSchema = new Schema({
  key: { type: String, required: true, unique: true }, // Unique technical identifier
  name: { type: String, required: true }, // Display name in Spanish
  description: { type: String, required: true }, // Description in Spanish
  category: { type: String, required: true }, // Category for grouping
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Permission', permissionSchema);
