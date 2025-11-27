// middleware/errorHandler.js
// Central Express error handler
module.exports = function errorHandler(err, req, res, next) {
  // If response already sent, delegate
  if (res.headersSent) {
    return next(err);
  }

  // Default
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  // Prepare payload
  const payload = {
    success: false,
    message,
  };

  // Attach validation errors (if present)
  if (err.errors) {
    payload.errors = err.errors;
  }

  // In non-production include stack for debugging
  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};
