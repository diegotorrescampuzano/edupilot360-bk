/*eslint-disable*/

// Import the onRequest function from Firebase Functions v2 HTTP module
const { onRequest } = require('firebase-functions/v2/https');
// Import the logger for structured logging in Firebase Functions
const logger = require('firebase-functions/logger');
// Import the Express app instance
const app = require('./app');

// Export the Express app as a single HTTPS Cloud Function
exports.app = onRequest(app);
