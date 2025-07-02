/* eslint-disable */
const express = require('express');
const router = express.Router();

// Import authentication middleware
const authMiddleware = require('../../../middleware/auth.middleware');

// Import controllers
const createUser = require('../controllers/createUser.controller');
const getUserByIdentifier = require('../controllers/getUserByIdentifier.controller');

// POST /v1/users - Crear usuario (protegido)
router.post('/', authMiddleware, createUser);

// GET /v1/users/:identifier?by=firebaseUid|_id|email - Obtener usuario por identificador (protegido)
router.get('/:identifier', authMiddleware, getUserByIdentifier);

module.exports = router;
