const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const RefreshToken = require("../models/refreshToken");

// generateToken function
const accessToken = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRE,
    }
  );
  return token;
};

const refreshToken = async (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    }
  );

  const userToken = await RefreshToken.findOne({ userId: user._id });
  if (userToken)
    await userToken.deleteOne({
      userId: user._id,
    });

  await RefreshToken.create({
    userId: user._id,
    refreshToken: token,
  });

  return token;
};

module.exports = {
  accessToken,
  refreshToken,
};
