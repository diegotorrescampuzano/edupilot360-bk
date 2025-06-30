/* eslint-disable */

// Import the Express framework to create a router
const express = require('express');
// Create a new router instance for user-related routes
const router = express.Router();

// Import the controller for creating a user
// (GET controller is commented out for now)
const createUser = require('../controllers/createUser.controller');
// const getUser = require('../controllers/getUser.controller');

// Define the POST /users route to handle user creation
router.post('/', createUser);

// Define the GET /users route to list users (currently commented out)
// router.get('/', getUser);

// Export the router so it can be mounted in the main app
module.exports = router;
