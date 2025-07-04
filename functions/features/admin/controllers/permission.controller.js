/* eslint-disable */
// Controllers for permissions endpoints

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

// List all permissions grouped by category and sorted by name
exports.listPermissionsGrouped = async (req, res) => {
  try {
    await connectToMongo();

    // Aggregate by category, sort by name
    const permissions = await Permission.aggregate([
      { $sort: { category: 1, name: 1 } },
      {
        $group: {
          _id: '$category',
          permissions: {
            $push: {
              key: '$key',
              name: '$name',
              description: '$description'
            }
          }
        }
      },
      { $project: { category: '$_id', permissions: 1, _id: 0 } }
    ]);

    logger.info('Permissions listed (grouped by category)');
    res.status(200).json({ data: permissions });
  } catch (error) {
    logger.error('Permission list error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
