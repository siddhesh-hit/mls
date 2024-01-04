const asyncHandler = require("express-async-handler");
const cookieParser = require("cookie-parser");

const User = require("../models/userModel");
const RefreshToken = require("../models/refreshToken");

const {
  loginEmailValidate,
  loginPhoneValidate,
  registerEmailValidate,
  registerPhoneValidate,
  updateUserValidate,
} = require("../validations/userValidation");

const { accessToken, refreshToken } = require("../utils/generateToken");
const otpGenerator = require("../utils/otpGenerator");
const generatePassword = require("../utils/passwordGenerator");

const emailInviteUser = require("../services/emailInviteUser");
const otpEmailGenerator = require("../services/otpEmailGenerator");
const emailReset = require("../services/emailReset");

const cookieParserMiddleware = cookieParser();

// @desc    Register a new user using phone
// @route   POST /api/user/registerPhone
// @access  Public
const registerUserPhone = asyncHandler(async (req, res) => {
  try {
    const { phone_number } = req.body;
    const { error } = registerPhoneValidate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
    let phone_otp = 1234;

    const user = await User.findOne({ phone_number });
    if (user) {
      if (user.user_verfied) {
        res.status(400);
        throw new Error("User already exists");
      } else {
        await user.deleteOne({ _id: user._id });
      }
    }

    const newUser = await User.create({ phone_number, phone_otp });
    if (!newUser) {
      res.status(400);
      throw new Error("Invalid user data");
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Verifying OTP using phone
// @route   POST /api/user/verifyPhone
// @access  Public
const verifyUserPhone = asyncHandler(async (req, res) => {
  try {
    const { phone_number, phone_otp } = req.body;

    const user = await User.findOne({ phone_number });
    if (!user) {
      res.status(400);
      throw new Error("User does not exists");
    }

    if (user.phone_otp !== phone_otp) {
      res.status(400);
      throw new Error("Invalid OTP");
    }

    user.phone_otp = "";
    user.user_verfied = true;
    await user.save();

    res.status(201).json({
      success: true,
      message: "User verified successfully",
      user,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
    });
    throw new Error(error);
  }
});

// @desc    Register a new user using email
// @route   POST /api/user/registerEmail
// @access  Public
const registerUserEmail = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let file = req.file;

    let email = data.email;

    console.log(data);

    // add image to data
    data.user_image = file ? file : {};

    // check if email already exists
    const { error } = registerEmailValidate(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // check if email already exists
    let user = await User.findOne({ email });
    if (user) {
      if (user.user_verfied) {
        res.status(400);
        throw new Error("User already exists");
      } else {
        await user.deleteOne({ _id: user._id });
      }
    }

    // generate otp and send email
    // const otp = otpGenerator();
    // otpEmailGenerator(email, otp);
    const otp = 1234;
    // create new user
    const newUser = await User.create({
      ...data,
      email_otp: otp,
    });
    if (!newUser) {
      res.status(400);
      throw new Error("Invalid user data");
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Verifying OTP using email
// @route   POST /api/user/verifyEmail
// @access  Public
const verifyUserEmail = asyncHandler(async (req, res) => {
  try {
    const { email, email_otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User does not exists");
    }

    if (user.email_otp !== email_otp) {
      res.status(400);
      throw new Error("Invalid OTP");
    }

    user.email_otp = "";
    user.user_verfied = true;
    await user.save();

    res.status(201).json({
      success: true,
      message: "User verified successfully",
      user,
    });
  } catch (error) {
    res.status(501);
    throw new Error(error);
  }
});

// @desc    Login user using phone
// @route   POST /api/user/loginPhone
// @access  Public
const loginUserPhone = asyncHandler(async (req, res) => {});

// @desc    Login user using email
// @route   POST /api/user/loginEmail
// @access  Public
const loginUserEmail = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // check validation
    const { error } = loginEmailValidate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User does not exists");
    }

    // check if user is verified
    if (!user.user_verfied) {
      res.status(400);
      throw new Error("User not verified");
    }

    // check if password is correct
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid credentials");
    }

    // generate access token and refresh token
    const access_token = accessToken(user);
    const refresh_token = await refreshToken(user);

    // set cookies
    res.cookie("accessToken", access_token, {
      httpOnly: true, // set true if the client does not need to read it via JavaScript
      secure: true, // set to false if not using https
      sameSite: "None",
    });
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(201).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    res.status(501);
    throw new Error(error);
  }
});

// @desc    Logout user
// @route   POST /api/user/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  try {
    // Parse cookies using cookie-parser
    cookieParserMiddleware(req, res, () => {});

    const refresh_token = req.cookies.refreshToken;
    const access_token = req.cookies.accessToken;

    // check if refresh token exists
    if (!refresh_token) {
      res.status(400);
      throw new Error("Refresh token not found");
    }

    console.log(refresh_token);

    // check if refresh token is valid
    const checkStoredToken = await RefreshToken.findOne({
      refreshToken: refresh_token,
    });

    if (!checkStoredToken) {
      res.status(400);
      throw new Error("Refresh token not found");
    }

    console.log(checkStoredToken);

    // check if user exists
    const userExists = User.findById(checkStoredToken.userId);
    if (!userExists) {
      res.status(400);
      throw new Error("User not found");
    }

    // delete refresh token
    await RefreshToken.deleteOne({ refreshToken: refresh_token });

    // delete cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(201).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(501);
    throw new Error(error);
  }
});

// @desc    Invite user
// @route   POST /api/user/invite
// @access  Public
const inviteUser = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let file = req.file;

    data = JSON.parse(data.data);
    data.user_image = file;

    // Generate a password of length 16 with uppercase letters, numbers, and symbols
    const password = generatePassword(16, true, true, true);
    data.password = password;

    // check validation
    const { error } = registerEmailValidate(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // check if user exists
    const userCheck = await User.findOne({ email: data.email });
    if (userCheck) {
      res.status(400);
      throw new Error("User already exists");
    }

    // send invitation email
    const resEmail = emailInviteUser(data.email, password);
    console.log(resEmail);
    console.log(data.email);

    // register user
    const user = await User.create({ ...data, user_verfied: true });
    if (!user) {
      res.status(400);
      throw new Error("User not registered");
    }

    res.status(201).json({
      success: true,
      message: "User invited successfully",
      data: user,
    });
  } catch (error) {
    res.status(501);
    throw new Error(error);
  }
});

// @desc    Forgot user
// @route   POST /api/user/forgot
// @access  Public
const forgotUser = asyncHandler(async (req, res) => {
  try {
    let { email } = req.body;

    // check if user exists
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      res.status(400);
      throw new Error("User does not exists");
    }

    // mail the reset password link
    emailReset(email);

    res.status(201).json({
      success: true,
      message: "Reset password link sent successfully",
    });
  } catch (error) {
    res.status(501);
    throw new Error(error);
  }
});

// @desc    Reset user password
// @route   POST /api/user/reset
// @access  Public
const resetUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      res.status(400);
      throw new Error("User does not exists");
    }

    // update password
    checkUser.password = password;
    await checkUser.save();

    res.status(201).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(501);
    throw new Error(error);
  }
});

// @desc    Get all users
// @route   GET /api/user
// @access  Admin
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).select(
      "_id full_name houses department designation email phone_number gender date_of_birth user_image"
    );
    if (!users) {
      res.status(400);
      throw new Error("No users found");
    }

    res.status(201).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(501);
    throw new Error(error);
  }
});

// @desc    Get user by id
// @route   GET /api/user/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "_id full_name houses department designation email phone_number gender date_of_birth user_image"
    );
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    res.status(201).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    res.status(501);
    throw new Error(error);
  }
});

// @desc    Update user
// @route   PUT /api/user/:id
// @access  Public
const updateUser = asyncHandler(async (req, res) => {
  try {
    let data = req.body.data;
    let file = req.file;

    data = JSON.parse(data);

    let email = data.email;

    // add image to data
    data.user_image = file ? file : data.user_image;

    console.log(data);

    // check if email already exists
    const { error } = updateUserValidate(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // check if email already exists
    let user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User does not exists");
    }

    // update user
    const userUpdated = await User.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!userUpdated) {
      res.status(400);
      throw new Error("User not updated");
    }

    res.status(201).json({
      success: true,
      message: "User updated successfully",
      data: userUpdated,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete user
// @route   DELETE /api/user/:id
// @access  Public
const deleteUser = asyncHandler(async (req, res) => {
  try {
    // check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    // delete
    await user.deleteOne({ _id: user._id });

    res.status(201).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(501);
    throw new Error(error);
  }
});

// @desc    Regenerate the access token
// @route   POST /api/user/accessToken
// @access  Public
const regenerateAccessToken = asyncHandler(async (req, res) => {
  try {
    // check if access token exists
    const accessOldToken = req.cookies.accessToken;
    if (!accessOldToken) {
      res.status(400);
      throw new Error("Access token not found");
    }

    // check if access token is valid
    const checkStoredToken = await RefreshToken.findOne({
      userId: req.user._id,
    });
    if (!checkStoredToken) {
      res.status(400);
      throw new Error("Refresh token not found");
    }

    // check if user exists
    const user = await User.findById(checkStoredToken.userId);
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    // generate new access token save it
    const access_token = accessToken(user);

    // set new cookies
    res.cookie("accessToken", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(201).json({
      success: true,
      message: "Access token generated successfully",
    });
  } catch (error) {
    res.status(501);
    throw new Error(error);
  }
});

// @desc    Regenerate the refresh token
// @route   POST /api/user/refreshToken
// @access  Public
const regenerateRefreshToken = asyncHandler(async (req, res) => {
  try {
    // check if refresh token exists
    const refreshOldToken = req.cookies.refreshToken;
    if (!refreshOldToken) {
      res.status(400);
      throw new Error("Refresh token not found");
    }

    // check if refresh token is valid
    const checkStoredToken = await RefreshToken.findOne({
      refreshToken: refreshOldToken,
    });

    // check if user exists
    const user = await User.findById(checkStoredToken.userId);
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    // generate new refresh token and access token save it
    const access_token = accessToken(user);
    const refresh_token = await refreshToken(user);

    // set new cookies
    res.cookie("accessToken", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(201).json({
      success: true,
      message: "Refresh token & Access token generated successfully",
    });
  } catch (error) {
    res.status(501);
    throw new Error(error);
  }
});

// @desc    Check logged in
// @route   GET /api/user/validate
// @access  Public
// const

module.exports = {
  registerUserPhone,
  verifyUserPhone,
  registerUserEmail,
  verifyUserEmail,
  loginUserPhone,
  loginUserEmail,
  logoutUser,
  inviteUser,
  forgotUser,
  resetUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  regenerateAccessToken,
  regenerateRefreshToken,
};
