/* eslint-disable */
// Mongoose model for campuses collection

const mongoose = require('mongoose');
const { Schema } = mongoose;

const campusSchema = new Schema({
  customId: { type: String, required: true, unique: true }, // Unique custom identifier
  name: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, required: true }, // e.g. urbana, rural
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campus', campusSchema);
