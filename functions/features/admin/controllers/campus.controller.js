/* eslint-disable */
// Controller for campuses endpoints (flat array, all fields, no grouping)

const { connectToMongo } = require('../../../db');
const Campus = require('../campus.model');
const logger = require('firebase-functions/logger');

// Create or update a campus by customId
exports.createOrUpdateCampus = async (req, res) => {
  try {
    await connectToMongo();

    const { customId, name, address, type } = req.body;
    if (!customId || !name || !address || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upsert (create or update)
    const updated = await Campus.findOneAndUpdate(
      { customId },
      {
        $set: {
          name,
          address,
          type,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    logger.info('Campus created/updated', { customId });
    res.status(200).json({ data: updated });
  } catch (error) {
    logger.error('Campus create/update error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

// List all campuses as a flat array, sorted by type and name
exports.listCampusesFlat = async (req, res) => {
  try {
    await connectToMongo();

    // Find all campuses, sort by type and name
    const campuses = await Campus.find().sort({ type: 1, name: 1 }).lean();

    logger.info('Campuses listed (flat, all fields)', { count: campuses.length });

    res.status(200).json({ data: campuses });
  } catch (error) {
    logger.error('Campus list error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
