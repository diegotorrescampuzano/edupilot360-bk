/* eslint-disable */
const express = require('express');
const router = express.Router();

// Import authentication middleware
const authMiddleware = require('../../../middleware/auth.middleware');

// Import controllers
const createUser = require('../controllers/createUser.controller');
// const getUser = require('../controllers/getUser.controller');

// Protect the POST route with authentication middleware
router.post('/', authMiddleware, createUser);

// router.get('/', getUser);

module.exports = router;
