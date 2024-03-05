// external
const asyncHandler = require("express-async-handler");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// internal
const AuditTrail = require("../models/reports/AuditTrail");
const User = require("../models/portals/userModel");

// instantiate
const cookieParserMiddleware = cookieParser();
dotenv.config();

// logger
const logging = asyncHandler(async (req, res, next) => {
  cookieParserMiddleware(req, res, () => {});

  let responseMes;

  // capture res and capture msg
  const originalJson = res.json;
  res.json = function (data) {
    responseMes = data.message;
    res.json = originalJson;
    return res.json(data);
  };

  // to capture the res message
  res.on("finish", async () => {
    try {
      const refresh_token = req?.cookies?.refreshToken;
      let decoded, user;

      // Handle token verification
      if (refresh_token) {
        try {
          decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
          user = await User.findById(decoded.id).select("-password");
        } catch (err) {
          if (err instanceof jwt.TokenExpiredError) {
            // console.error("Token expired:", err);
          } else if (err instanceof jwt.JsonWebTokenError) {
            // console.error("Invalid token:", err);
          } else {
            // console.error("Error verifying token:", err);
          }
        }
      }

      if (responseMes) {
        await AuditTrail.create({
          userIp: res.ip,
          userId: user ? user._id : null,
          endPoints: req.originalUrl,
          method: req.method,
          query: req.query,
          message: responseMes,
          userAgent: req.get("User-Agent"),
          clientSide: req.get("origin"),
          statusCode: res.statusCode,
        });
      }
    } catch (error) {
      console.error("Error occurred while capturing audit trail:", error);
    }
  });

  next();
});

module.exports = { logging };
