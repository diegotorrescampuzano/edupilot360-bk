/* eslint-disable */
/**
 * Express Router for all v1 API endpoints
 * Add new v1 endpoints here to keep versioning centralized
 */

const express = require('express');
const router = express.Router();

// Import feature routers
const usersRoutes = require('../features/users/routes/users.routes');

// Mount user routes under /users (e.g., /v1/users)
router.use('/users', usersRoutes);

// Add future v1 feature routers here

module.exports = router;
