/* eslint-disable */
// Controllers for campuses endpoints

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

// List all campuses grouped by type and sorted by name
exports.listCampusesGrouped = async (req, res) => {
  try {
    await connectToMongo();

    // Aggregate by type, sort by name
    const campuses = await Campus.aggregate([
      { $sort: { type: 1, name: 1 } },
      {
        $group: {
          _id: '$type',
          campuses: {
            $push: {
              customId: '$customId',
              name: '$name',
              address: '$address'
            }
          }
        }
      },
      { $project: { type: '$_id', campuses: 1, _id: 0 } }
    ]);

    logger.info('Campuses listed (grouped by type)');
    res.status(200).json({ data: campuses });
  } catch (error) {
    logger.error('Campus list error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
