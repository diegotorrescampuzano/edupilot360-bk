/* eslint-disable */

// Import the Express framework
const express = require('express');
// Create a new Express application instance
const app = express();

// Enable JSON body parsing for incoming requests
app.use(express.json());

// Import the route handlers for different features (users, roles, etc.)
const usersRoutes = require('./features/users/routes/users.routes');
// const rolesRoutes = require('./features/roles/routes/roles.routes');
// const sedesRoutes = require('./features/sedes/routes/sedes.routes');
// const userRolesRoutes = require('./features/user_roles/routes/userRoles.routes');

// Route to get environment variables
app.get('/env', (req, res) => {
  res.json({
    project: process.env.GCLOUD_PROJECT,
    mongoUri: process.env.MONGO_URI ? '***REDACTED***' : 'undefined'
  });
});

// Mount the user routes under the '/users' path
app.use('/users', usersRoutes);
// Mount other feature routes under their respective paths (uncomment when ready)
// app.use('/roles', rolesRoutes);
// app.use('/sedes', sedesRoutes);
// app.use('/user-roles', userRolesRoutes);

// Export the configured Express app for use in Cloud Functions
module.exports = app;
