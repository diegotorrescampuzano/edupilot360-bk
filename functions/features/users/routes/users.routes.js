/* eslint-disable */
const express = require('express');
const router = express.Router();

// Import authentication middleware
const authMiddleware = require('../../../middleware/auth.middleware');

// Import controllers
const createUser = require('../controllers/createUser.controller');
const getUserByIdentifier = require('../controllers/getUserByIdentifier.controller');
const getUsers = require('../controllers/getUsers.controller');
const updateUser = require('../controllers/updateUser.controller');
const deleteUser = require('../controllers/deleteUser.controller');

// POST /v1/users - Create new user (protected)
router.post('/', authMiddleware, createUser);

// GET /v1/users/:identifier - Get user by identifier (protected)
router.get('/:identifier', authMiddleware, getUserByIdentifier);

// GET /v1/users/search/all - Multi-criteria search (protected)
router.get('/search/all', authMiddleware, getUsers);

// PATCH /v1/users/:identifier?by=firebaseUid|_id|email - Update user (protected)
router.patch('/:identifier', authMiddleware, updateUser);

// DELETE /v1/users/:id - Delete user by _id (protected)
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
