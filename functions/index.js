const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');

// Healthcheck para QA o Prod (la misma función para ambos ambientes)
exports.healthcheck = onRequest((req, res) => {
  logger.info("Healthcheck llamado", {structuredData: true});
  // Puedes usar variables de entorno para diferenciar QA/Prod
  res.status(200).json({
    status: 'active',
    environment: process.env.ENVIRONMENT || 'local',
    timestamp: new Date().toISOString()
  });
});
