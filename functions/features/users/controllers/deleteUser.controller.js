/* eslint-disable */
/**
 * Controller to delete a user from the database by MongoDB _id
 * Requires token validation middleware before access
 * Returns deleted user data in a "data" attribute
 */

const { connectToMongo } = require('../../../db');
const User = require('../user.model');
const logger = require('firebase-functions/logger');

module.exports = async (req, res) => {
  try {
    // Establish MongoDB connection
    await connectToMongo();

    // Extract user _id from request params
    const userId = req.params.id;

    // Validate _id parameter
    if (!userId) {
      return res.status(400).json({ error: "User ID (_id) is required in the URL path." });
    }

    // Attempt to find and delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    // If not found, return error
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Log and return deleted user
    logger.info('User deleted', { userId: deletedUser._id });
    return res.status(200).json({ data: deletedUser });
  } catch (error) {
    logger.error('User deletion error', { error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
