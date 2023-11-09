const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/userModel");

const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("Not authorized users");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
    throw new Error("Not authorized, no token.");
  }
});

const superAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.user_role !== "Super Admin") {
    res.status(403);
    throw new Error("Not authorized as a super admin");
  }
  next();
});

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.user_role !== "Admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
  next();
});

const isManager = asyncHandler(async (req, res, next) => {
  if (req.user.user_role !== "Manager") {
    res.status(403);
    throw new Error("Not authorized as a manager");
  }
  next();
});

const isUser = asyncHandler(async (req, res, next) => {
  if (req.user.user_role !== "User") {
    res.status(403);
    throw new Error("Not authorized as a user");
  }
  next();
});

module.exports = { authMiddleware, superAdmin, isAdmin, isManager, isUser };
