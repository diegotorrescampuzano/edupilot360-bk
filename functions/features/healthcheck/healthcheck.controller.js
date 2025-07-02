/* eslint-disable */
/**
 * Basic healthcheck controller
 * Returns a simple JSON response to indicate service is running
 */

module.exports = (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
};
