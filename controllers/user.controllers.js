const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const {
  loginEmailValidate,
  loginPhoneValidate,
  registerEmailValidate,
  registerPhoneValidate,
} = require("../validations/userValidation");
const { accessToken, refreshToken } = require("../utils/generateToken");
const otpEmailGenerator = require("../services/otpEmailGenerator");
const otpGenerator = require("../utils/otpGenerator");

// @desc    Register a new user using phone ==> /api/users/registerPhone
const registerUserPhone = asyncHandler(async (req, res) => {
  try {
    const { phone_number } = req.body;
    const { error } = registerPhoneValidate(phone_number);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
    let phone_otp = 1234;

    const user = await User.findOne({ phone_number });
    if (user) {
      res.status(400);
      throw new Error("User already exists");
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
    res.status(501).json({
      success: false,
    });
    throw new Error(error);
  }
});

// @desc    Verifying OTP using phone ==> /api/users/verifyPhone
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

// @desc    Register a new user using email ==> /api/users/registerEmail
const registerUserEmail = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = registerEmailValidate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    const user = await User.findOne({ email });
    if (user) {
      res.status(400);
      throw new Error("User already exists");
    }
    const otp = otpGenerator();

    const info = await otpEmailGenerator(email, otp);

    const newUser =
      info &&
      (await User.create({
        email,
        password,
        email_otp: otp,
        phone_number: "",
      }));
    if (!newUser) {
      res.status(400);
      throw new Error("Invalid user data");
    }

    if (newUser) {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: newUser,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    // res.status(501).json({
    //   success: false,
    // });
    throw new Error(error);
  }
});

// @desc    Verifying OTP using email ==> /api/users/verifyEmail
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
    // res.status(501).json({
    //   success: false,
    // });
    throw new Error(error);
  }
});

// @desc    Login user using phone ==> /api/users/loginPhone
const loginUserPhone = asyncHandler(async (req, res) => {});

// @desc    Login user using email ==> /api/users/loginEmail
const loginUserEmail = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = loginEmailValidate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400);
      throw new Error("User does not exists");
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid credentials");
    }

    const access_token = accessToken(user._id);
    const refresh_token = refreshToken(user._id);

    res.cookie("accessToken", access_token, {
      httpOnly: false, // set true if the client does not need to read it via JavaScript
      secure: true, // set to false if not using https
      sameSite: "Lax",
    });

    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      access_token,
      refresh_token,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
    });
    throw new Error(error);
  }
});

// @desc    Logout user ==> /api/users/logout
const logoutUser = asyncHandler(async (req, res) => {});

// @desc    Get all users ==> /api/users/
const getUsers = asyncHandler(async (req, res) => {});

// @desc    Get user by id ==> /api/users/:id
const getUserById = asyncHandler(async (req, res) => {});

// @desc    Update user ==> /api/users/:id
const updateUser = asyncHandler(async (req, res) => {});

// @desc    Delete user ==> /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {});

module.exports = {
  registerUserPhone,
  verifyUserPhone,
  registerUserEmail,
  verifyUserEmail,
  loginUserPhone,
  loginUserEmail,
  logoutUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
