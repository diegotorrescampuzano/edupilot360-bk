/* eslint-disable */
/**
 * Controller to update user data by unique identifier
 * Supports updates via firebaseUid, _id, or email
 * Only fields present in the body will be updated; firebaseUid is not editable
 * Returns the updated user data in a "data" attribute as per JSON API standard
 */

const { connectToMongo } = require('../../../db');
const User = require('../user.model');
const logger = require('firebase-functions/logger');

module.exports = async (req, res) => {
  try {
    // Connect to MongoDB
    await connectToMongo();

    // Get identifier from URL and query to specify type
    const identifier = req.params.identifier;
    const by = req.query.by;

    // Ensure identifier criteria provided
    if (!by || !identifier) {
      return res.status(400).json({ error: 'Missing identifier or "by" query parameter. Use by=firebaseUid|_id|email.' });
    }

    // Build filter based on identifier type
    let filter;
    if (by === 'firebaseUid') {
      filter = { firebaseUid: identifier };
    } else if (by === '_id') {
      filter = { _id: identifier };
    } else if (by === 'email') {
      filter = { email: identifier };
    } else {
      return res.status(400).json({ error: 'Invalid "by" query parameter. Use firebaseUid, _id, or email.' });
    }

    // Prevent editing firebaseUid directly
    if ('firebaseUid' in req.body) {
      return res.status(400).json({ error: "firebaseUid field cannot be edited" });
    }

    // Only allow updating permitted fields
    const allowedFields = ['name', 'email', 'phone', 'address', 'status'];
    const updateData = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields provided for update" });
    }

    updateData.updatedAt = new Date();

    // Perform the update
    const updatedUser = await User.findOneAndUpdate(
      filter,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    logger.info('User updated', { identifier, by });
    res.status(200).json({ data: updatedUser });
  } catch (error) {
    // Handle duplicate fields
    if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        error: `${duplicatedField} already exists in the database`
      });
    }
    logger.error('User update error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
