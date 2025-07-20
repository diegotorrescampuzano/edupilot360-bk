/* eslint-disable */

const express = require('express');
const router = express.Router();

// Import authentication middleware
const authMiddleware = require('../../../middleware/auth.middleware');

// Import controllers
const createUser = require('../controllers/createUser.controller');
const getUserByIdentifier = require('../controllers/getUserByIdentifier.controller');
const getUsers = require('../controllers/getUsers.controller'); // NEW

// POST /v1/users - Create new user (protected)
router.post('/', authMiddleware, createUser);

// GET /v1/users/:identifier - Get user by specific identifier (protected)
router.get('/:identifier', authMiddleware, getUserByIdentifier);

// GET /v1/users/search?name=&email=&address=... - Multi-criteria search (protected)
router.get('/search/all', authMiddleware, getUsers);

module.exports = router;
