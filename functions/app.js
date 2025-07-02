/* eslint-disable */

// Import the Express framework
const express = require('express');
const app = express();

// Enable JSON body parsing for incoming requests
app.use(express.json());

// Import v1 routes grouped in a single router
const v1Routes = require('./routes/v1.routes');

// Import healthcheck controller
const healthcheckController = require('./features/healthcheck/healthcheck.controller');

// Healthcheck endpoint (not versioned)
app.get('/healthcheck', healthcheckController);

// Mount all v1 routes under /v1 path
app.use('/v1', v1Routes);

module.exports = app;
