/* eslint-disable */
// Controllers for user_roles endpoints

const { connectToMongo } = require('../../../db');
const UserRole = require('../userRole.model');
const User = require('../../users/user.model');
const Role = require('../role.model');
const Campus = require('../campus.model');
const logger = require('firebase-functions/logger');

// Create a user-role-campus relation (no duplicates)
exports.createUserRoleRelation = async (req, res) => {
  try {
    await connectToMongo();

    const { userId, roleId, campusId } = req.body;
    if (!userId || !roleId || !campusId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for existing relation
    const exists = await UserRole.findOne({ userId, roleId, campusId });
    if (exists) {
      logger.warn('Duplicate user-role-campus relation', { userId, roleId, campusId });
      return res.status(409).json({ error: 'Relation already exists' });
    }

    const newRelation = new UserRole({ userId, roleId, campusId });
    await newRelation.save();

    logger.info('User-role-campus relation created', { userId, roleId, campusId });
    res.status(201).json({ data: newRelation });
  } catch (error) {
    logger.error('UserRole create error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

// Get all user_roles relations for a user (with populated fields)
exports.getUserRolesByUserId = async (req, res) => {
  try {
    await connectToMongo();

    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId param' });
    }

    // Populate role and campus fields for full info
    const relations = await UserRole.find({ userId })
      .populate('roleId')
      .populate('campusId');

    logger.info('UserRole relations fetched for user', { userId, count: relations.length });
    res.status(200).json({ data: relations });
  } catch (error) {
    logger.error('UserRole fetch error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
