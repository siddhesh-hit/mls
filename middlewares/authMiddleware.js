const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/portals/userModel");
const cookieParser = require("cookie-parser");

const cookieParserMiddleware = cookieParser();

// const roles = {
// "create", "read", "update", "delete", "download", "upload";
//   superadmin: ["create", "read", "update", "delete", "user", "download", "upload", "block"],
//   admin: ["create", "read", "update", "delete", "user"],
//   reviewer: ["read"],
//   contentcreator: ["create", "update"],
//   user: ["read"],
// };

const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    // Parse cookies using cookie-parser
    cookieParserMiddleware(req, res, () => {});

    const refresh_token = req.cookies.refreshToken;
    const access_token = req.cookies.accessToken;

    // console.log(access_token, "==============================>");
    // console.log(refresh_token, "==============================>");

    if (!refresh_token) {
      res.status(401);
      throw new Error("Not authorized users");
    }

    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
      res.status(403);
      throw new Error("Not an authorized token");
    }

    const decoded1 = jwt.verify(access_token, process.env.JWT_ACCESS_SECRET);

    if (!decoded1) {
      res.status(403);
      throw new Error("Not an authorized token.");
    }

    // if (decoded1.exp > date) {
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Not an user in the database");
    }

    res.locals.userInfo = decoded;

    req.user = decoded;
    next();

    // } else {
    //   res.status(402);
    //   throw new Error("Access token is expired.");
    // }
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, no token. " + error);
  }
});

const checkRoleMiddleware = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403);
      throw new Error("Not authorized for this route");
    }
  };
};

const hasPermission = (permissionName = "none") => {
  return function (req, res, next) {
    const userPermission = req.user.permission;

    if (userPermission.includes(permissionName)) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        result: null,
        message: "Access denied : you are not granted permission.",
      });
    }
  };
};

module.exports = { authMiddleware, checkRoleMiddleware, hasPermission };
// enum: ["Admin", "SuperAdmin", "Reviewer", "ContentCreator", "User"],
// Admin : Reviewer: Can view and share the remark
// Admin : Content creator : Can create, update and edit.
