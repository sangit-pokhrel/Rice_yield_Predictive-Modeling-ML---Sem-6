// middleware/notFound.js
// Use after all routes to catch 404s
module.exports = function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`,
  });
};
