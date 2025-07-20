/* eslint-disable */
/**
 * Controller to search for users based on partial matches
 * Supports multiple criteria using OR logic (name, email, address, status, etc.)
 * Returns a list of matching users in a "data" attribute
 */

const { connectToMongo } = require('../../../db');
const User = require('../user.model');
const logger = require('firebase-functions/logger');

module.exports = async (req, res) => {
  try {
    // Establish MongoDB connection
    await connectToMongo();

    // Destructure search parameters from query string
    const {
      name,
      email,
      address,
      status,
      firebaseUid,
      _id
    } = req.query;

    // Build the dynamic OR query
    const queryConditions = [];

    if (name) {
      queryConditions.push({ name: { $regex: name, $options: 'i' } });
    }
    if (email) {
      queryConditions.push({ email: { $regex: email, $options: 'i' } });
    }
    if (address) {
      queryConditions.push({ address: { $regex: address, $options: 'i' } });
    }
    if (status) {
      queryConditions.push({ status: { $regex: status, $options: 'i' } });
    }
    if (firebaseUid) {
      queryConditions.push({ firebaseUid: { $regex: firebaseUid, $options: 'i' } });
    }
    if (_id) {
      queryConditions.push({ _id: _id }); // Match exact if provided
    }

    // If no criteria provided, return 400
    if (queryConditions.length === 0) {
      return res.status(400).json({
        error: 'At least one search parameter must be provided.'
      });
    }

    // Combine using OR logic
    const users = await User.find({ $or: queryConditions });

    logger.info('Users fetched based on search criteria', { count: users.length });

    res.status(200).json({ data: users });
  } catch (error) {
    logger.error('Error fetching users', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
