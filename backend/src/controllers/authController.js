// // controllers/authController.js
// require("dotenv").config();
// const { validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const RefreshToken = require("../models/RefreshToken");
// const ms = require("ms"); // optional for human-readable TTL if you want, else parse manually

// const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
// const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
// const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "15m";
// const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || "7d";
// const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
// const DEFAULT_AVATAR = process.env.DEFAULT_AVATAR || "/mnt/data/a1cc47db-98fc-4c1f-93be-5a4277ba6f4f.png";

// if (!ACCESS_SECRET || !REFRESH_SECRET) {
//   console.warn("JWT secrets not set in env. Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET.");
// }

// function signAccessToken(user) {
//   return jwt.sign({ id: user._id, role: user.role }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
// }

// function signRefreshToken(user) {
//   return jwt.sign({ id: user._id, role: user.role }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
// }

// function getExpiryDateFromExpiresIn(expiresIn) {
//   // Accept values like "15m", "7d" (we can be simple)
//   // ms package would turn to milliseconds; use Date.now + ms(expiresIn)
//   try {
//     const ms = require("ms");
//     const msVal = ms(expiresIn);
//     return new Date(Date.now() + msVal);
//   } catch (err) {
//     // fallback: compute minimal
//     const fallback = 1000 * 60 * 60 * 24 * 7; // 7 days
//     return new Date(Date.now() + fallback);
//   }
// }

// exports.register = async (req, res, next) => {
//   try {
//     // validation (from express-validator)
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//     const { fullName, email, password, phone } = req.body;
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: "Email already registered" });

//     const salt = await bcrypt.genSalt(SALT_ROUNDS);
//     const hash = await bcrypt.hash(password, salt);

//     const user = await User.create({
//       fullName,
//       email,
//       phone,
//       password: hash,
//       avatar: DEFAULT_AVATAR,
//     });

//     // create tokens
//     const accessToken = signAccessToken(user);
//     const refreshToken = signRefreshToken(user);

//     // persist refresh token
//     const rt = await RefreshToken.create({
//       token: refreshToken,
//       user: user._id,
//       expiresAt: getExpiryDateFromExpiresIn(REFRESH_EXPIRES),
//     });

//     res.status(201).json({
//       success: true,
//       data: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         avatar: user.avatar,
//       },
//       tokens: {
//         accessToken,
//         refreshToken,
//         accessExpiresIn: ACCESS_EXPIRES,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.login = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: "Invalid credentials" });

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) return res.status(401).json({ message: "Invalid credentials" });

//     // issue tokens
//     const accessToken = signAccessToken(user);
//     const refreshToken = signRefreshToken(user);

//     // persist refresh token
//     await RefreshToken.create({
//       token: refreshToken,
//       user: user._id,
//       expiresAt: getExpiryDateFromExpiresIn(REFRESH_EXPIRES),
//     });

//     res.json({
//       success: true,
//       data: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         avatar: user.avatar,
//       },
//       tokens: {
//         accessToken,
//         refreshToken,
//         accessExpiresIn: ACCESS_EXPIRES,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // Refresh endpoint: rotate token
// exports.refreshToken = async (req, res, next) => {
//   try {
//     const { refreshToken } = req.body;
//     if (!refreshToken) return res.status(400).json({ message: "refreshToken required" });

//     // verify signature
//     let payload;
//     try {
//       payload = jwt.verify(refreshToken, REFRESH_SECRET);
//     } catch (err) {
//       return res.status(401).json({ message: "Invalid refresh token" });
//     }

//     // check token exists in DB and not revoked and not expired
//     const stored = await RefreshToken.findOne({ token: refreshToken, user: payload.id });
//     if (!stored || stored.revoked) return res.status(401).json({ message: "Refresh token revoked or not found" });

//     if (new Date() > new Date(stored.expiresAt)) {
//       // token expired - remove
//       await RefreshToken.findByIdAndDelete(stored._id);
//       return res.status(401).json({ message: "Refresh token expired" });
//     }

//     // rotate: revoke old refresh token and issue a new one
//     stored.revoked = true;
//     await stored.save();

//     const user = await User.findById(payload.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const newAccessToken = signAccessToken(user);
//     const newRefreshToken = signRefreshToken(user);

//     await RefreshToken.create({
//       token: newRefreshToken,
//       user: user._id,
//       expiresAt: getExpiryDateFromExpiresIn(REFRESH_EXPIRES),
//     });

//     res.json({
//       success: true,
//       tokens: {
//         accessToken: newAccessToken,
//         refreshToken: newRefreshToken,
//         accessExpiresIn: ACCESS_EXPIRES,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.logout = async (req, res, next) => {
//   try {
//     // expecting refresh token in body to revoke
//     const { refreshToken } = req.body;
//     if (!refreshToken) return res.status(400).json({ message: "refreshToken required" });

//     // mark it revoked
//     await RefreshToken.findOneAndUpdate({ token: refreshToken }, { revoked: true });

//     res.json({ success: true, message: "Logged out (refresh token revoked)" });
//   } catch (err) {
//     next(err);
//   }
// };

// // Protected profile endpoints
// exports.getProfile = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json({ success: true, data: user });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.updateProfile = async (req, res, next) => {
//   try {
//     const allowed = (({ fullName, phone, avatar }) => ({ fullName, phone, avatar }))(req.body);
//     const user = await User.findByIdAndUpdate(req.user.id, { $set: allowed }, { new: true }).select("-password");
//     res.json({ success: true, data: user });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.deleteUser = async (req, res, next) => {
//   try {
//     await User.findByIdAndDelete(req.user.id);
//     // optionally revoke all refresh tokens for user
//     await RefreshToken.updateMany({ user: req.user.id }, { revoked: true });
//     res.json({ success: true, message: "User deleted and refresh tokens revoked" });
//   } catch (err) {
//     next(err);
//   }
// };
// controllers/authController.js
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "replace_this_with_env_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const DEFAULT_AVATAR = process.env.DEFAULT_AVATAR || "/mnt/data/a1cc47db-98fc-4c1f-93be-5a4277ba6f4f.png";

/**
 * Helper: sign JWT
 * payload contains user id and role
 */
function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Register
 * - Validate incoming request (express-validator should be run in route)
 * - Hash password here (in controller) so we do NOT depend on model pre('save')
 * - Use insertMany to bypass Mongoose save middleware (avoids pre-save hook issues)
 */
exports.register = async (req, res, next) => {
  try {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const { fullName, email, password, phone } = req.body;

    // check duplicates
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ success: false, message: "Email already in use" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Build user object (use insertMany to bypass pre-save)
    const userObj = {
      fullName,
      email: email.toLowerCase(),
      password: hashed,
      phone: phone || "",
      role: "user",
      avatar: DEFAULT_AVATAR,
    };

    // insertMany returns array of docs
    const inserted = await User.insertMany([userObj], { ordered: true });
    const user = inserted[0];

    // generate token
    const token = signToken(user);

    // return sanitized user
    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar || DEFAULT_AVATAR,
      },
      token,
    });
  } catch (err) {
    // if duplicate key or other DB error
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate field value", detail: err.keyValue });
    }
    next(err);
  }
};

/**
 * Login
 * - find user by email
 * - compare password using bcrypt
 * - return JWT
 */
exports.login = async (req, res, next) => {
  try {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = signToken(user);

    res.json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar || DEFAULT_AVATAR,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get profile (protected route)
 * authMiddleware should attach req.user = { id, role }
 */
exports.getProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: "Not authenticated" });
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

/**
 * Update profile (protected)
 * allow updating fullName, phone, avatar
 * if password update is desired, you can add behavior to hash it here
 */
exports.updateProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: "Not authenticated" });

    const allowed = {};
    if (req.body.fullName) allowed.fullName = req.body.fullName;
    if (req.body.phone) allowed.phone = req.body.phone;
    if (req.body.avatar) allowed.avatar = req.body.avatar;

    // if password change provided, hash it here
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      allowed.password = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await User.findByIdAndUpdate(req.user.id, { $set: allowed }, { new: true }).select("-password");
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete user (protected)
 */
exports.deleteUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: "Not authenticated" });

    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
