/* eslint-disable */
// Controller for permissions endpoints (flat array, all fields, no grouping)

const { connectToMongo } = require('../../../db');
const Permission = require('../permission.model');
const logger = require('firebase-functions/logger');

// Create or update a permission by key
exports.createOrUpdatePermission = async (req, res) => {
  try {
    await connectToMongo();

    const { key, name, description, category } = req.body;
    if (!key || !name || !description || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upsert (create or update)
    const updated = await Permission.findOneAndUpdate(
      { key },
      {
        $set: {
          name,
          description,
          category,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    logger.info('Permission created/updated', { key });
    res.status(200).json({ data: updated });
  } catch (error) {
    logger.error('Permission create/update error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

// List all permissions as a flat array, sorted by category and name
exports.listPermissionsFlat = async (req, res) => {
  try {
    await connectToMongo();

    // Find all permissions, sort by category and name
    const permissions = await Permission.find().sort({ category: 1, name: 1 }).lean();

    logger.info('Permissions listed (flat, all fields)', { count: permissions.length });

    res.status(200).json({ data: permissions });
  } catch (error) {
    logger.error('Permission list error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
