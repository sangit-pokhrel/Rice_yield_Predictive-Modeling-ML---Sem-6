// middleware/authMiddleware.js
require("dotenv").config();
const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization || req.headers["x-access-token"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  // Accept "Bearer <token>" or raw token
  let token = authHeader;
  if (authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};
