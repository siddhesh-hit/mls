const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/userModel");
const cookieParser = require("cookie-parser");

const cookieParserMiddleware = cookieParser();
const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    // Parse cookies using cookie-parser
    cookieParserMiddleware(req, res, () => {});

    const refresh_token = req.cookies.refreshToken;

    const access_token = req.cookies.accessToken;

    if (!refresh_token) {
      res.status(401);
      throw new Error("Not authorized users");
    }

    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
      res.status(401);
      throw new Error("Not an authorized token");
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Not an user in the database");
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, no token." + error);
  }
});

const checkRoleMiddleware = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized for this route");
    }
  };
};

module.exports = { authMiddleware, checkRoleMiddleware };
