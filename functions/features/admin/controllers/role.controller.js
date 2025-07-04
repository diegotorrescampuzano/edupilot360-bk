/* eslint-disable */
// Controllers for roles endpoints

const { connectToMongo } = require('../../../db');
const Role = require('../role.model');
const logger = require('firebase-functions/logger');

// Create or update a role by customId
exports.createOrUpdateRole = async (req, res) => {
  try {
    await connectToMongo();

    const { customId, name, description, permissions } = req.body;
    if (!customId || !name || !description || !Array.isArray(permissions)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upsert (create or update)
    const updated = await Role.findOneAndUpdate(
      { customId },
      {
        $set: {
          name,
          description,
          permissions,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    logger.info('Role created/updated', { customId });
    res.status(200).json({ data: updated });
  } catch (error) {
    logger.error('Role create/update error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

// List all roles sorted by name
exports.listRolesSorted = async (req, res) => {
  try {
    await connectToMongo();

    const roles = await Role.find().sort({ name: 1 });
    logger.info('Roles listed (sorted by name)');
    res.status(200).json({ data: roles });
  } catch (error) {
    logger.error('Role list error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
