/* eslint-disable */
const express = require('express');
const router = express.Router();

// Import authentication middleware
const authMiddleware = require('../../../middleware/auth.middleware');

// Import controllers
const permissionCtrl = require('../controllers/permission.controller');
const roleCtrl = require('../controllers/role.controller');
const campusCtrl = require('../controllers/campus.controller');
const userRoleCtrl = require('../controllers/userRole.controller');

// Permissions endpoints
router.post('/permissions', authMiddleware, permissionCtrl.createOrUpdatePermission);
router.get('/permissions', authMiddleware, permissionCtrl.listPermissionsFlat);

// Roles endpoints
router.post('/roles', authMiddleware, roleCtrl.createOrUpdateRole);
router.get('/roles', authMiddleware, roleCtrl.listRolesSorted);

// Campuses endpoints
router.post('/campuses', authMiddleware, campusCtrl.createOrUpdateCampus);
router.get('/campuses', authMiddleware, campusCtrl.listCampusesFlat);

// UserRole endpoints
router.post('/user_roles', authMiddleware, userRoleCtrl.createUserRoleRelation);
router.get('/user_roles/:userId', authMiddleware, userRoleCtrl.getUserRolesByUserId);

module.exports = router;
