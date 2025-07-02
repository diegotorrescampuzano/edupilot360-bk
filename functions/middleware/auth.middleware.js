/* eslint-disable */
/**
 * Firebase Authentication middleware
 * Validates Firebase Authentication ID tokens for API protection
 * 
 * Usage:
 *   router.post('/', authMiddleware, createUser);
 * 
 * Requires:
 *   Header 'Authorization: Bearer <token>'
 */

// Import Firebase Admin SDK
const admin = require('firebase-admin');
// Import Firebase Functions logger for structured logging
const logger = require('firebase-functions/logger');

// Initialize Firebase Admin if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Access attempt without token');
    return res.status(401).json({ 
      error: 'Unauthorized: No token provided' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    logger.info('Authenticated user:', { uid: decodedToken.uid });
    
    // Attach user info to the request for downstream use
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
    next();
  } catch (error) {
    logger.error('Token verification failed', { error: error.message });
    res.status(403).json({ 
      error: 'Unauthorized: Invalid token',
      details: error.message
    });
  }
};
