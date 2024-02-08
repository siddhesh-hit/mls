const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const RefreshToken = require("../models/portals/refreshToken");

// generateToken function
const accessToken = (user) => {
  console.log(user);

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role_taskId.role,
      permission: user.role_taskId.permission,
      taskName: user.role_taskId.taskName,
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
      role: user.role_taskId.role,
      permission: user.role_taskId.permission,
      taskName: user.role_taskId.taskName,
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

  const data = await RefreshToken.create({
    userId: user._id,
    refreshToken: token,
  });

  if (data) {
    return token;
  }
};

module.exports = {
  accessToken,
  refreshToken,
};
