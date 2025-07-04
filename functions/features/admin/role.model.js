/* eslint-disable */
// Mongoose model for roles collection

const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
  customId: { type: String, required: true, unique: true }, // Unique custom identifier
  name: { type: String, required: true }, // Role name
  description: { type: String, required: true }, // Role description
  permissions: [{ type: String, required: true }], // Array of permission keys
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Role', roleSchema);
