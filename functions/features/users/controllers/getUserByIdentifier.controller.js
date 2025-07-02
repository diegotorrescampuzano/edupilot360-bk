/* eslint-disable */
/**
 * Controller to get a user by firebaseUid, _id, or email
 * Uses query param ?by=firebaseUid|_id|email
 * Returns user data inside a "data" attribute as per JSON API standard
 */

const { connectToMongo } = require('../../../db');
const User = require('../user.model');
const logger = require('firebase-functions/logger');

module.exports = async (req, res) => {
  try {
    await connectToMongo();

    const identifier = req.params.identifier;
    const by = req.query.by;

    let user = null;

    if (by === 'firebaseUid') {
      user = await User.findOne({ firebaseUid: identifier });
    } else if (by === '_id') {
      user = await User.findById(identifier);
    } else if (by === 'email') {
      user = await User.findOne({ email: identifier });
    } else {
      return res.status(400).json({ error: 'Invalid or missing "by" query parameter. Use firebaseUid, _id, or email.' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    logger.info('User fetched', { by, identifier });
    res.status(200).json({ data: user });
  } catch (error) {
    logger.error('Error fetching user', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
