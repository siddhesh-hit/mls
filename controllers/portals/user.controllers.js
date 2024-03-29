const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../../models/portals/userModel");
const RefreshToken = require("../../models/portals/refreshToken");
const Notification = require("../../models/extras/Notification");
const Role_Task = require("../../models/portals/Role_Task");
const AuditTrail = require("../../models/reports/AuditTrail");
const UserDocument = require("../../models/extras/UserDocument");

const {
  loginEmailValidate,
  loginPhoneValidate,
  registerEmailValidate,
  registerPhoneValidate,
  updateUserValidate,
} = require("../../validations/portal/userValidation");

const { accessToken, refreshToken } = require("../../utils/generateToken");

const emailInviteUser = require("../../services/emailInviteUser");
const emailReset = require("../../services/emailReset");

const otpGenerator = require("../../utils/otpGenerator");
const otpEmailGenerator = require("../../services/otpEmailGenerator");
const generatePassword = require("../../utils/passwordGenerator");

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
      if (user.user_verified) {
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
      data: newUser,
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
    user.user_verified = true;
    await user.save();

    res.status(201).json({
      success: true,
      message: "User verified successfully",
      data: user,
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
      if (user.user_verified) {
        res.status(400);
        throw new Error("User already exists");
      } else {
        await user.deleteOne({ _id: user._id });
      }
    }

    // generate otp and send email
    const otp = otpGenerator();
    console.log(otp);
    otpEmailGenerator(email, otp);

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
      data: newUser,
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
    user.user_verified = true;

    const role_task = await Role_Task.create({
      userId: user._id,
    });

    if (!role_task) {
      res.status(402);
      await User.findByIdAndDelete(user._id);
      throw new Error("Failed to create user's role & task management.");
    }

    const notification = await Notification.create({
      userId: user._id,
    });

    if (!notification) {
      res.status(402);
      await User.findByIdAndDelete(user._id);
      throw new Error("Failed to create user's notification.");
    }

    user.role_taskId = role_task._id;
    user.notificationId = notification._id;
    await user.save();

    // generate access token and refresh token
    const access_token = await accessToken(user);
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
      message: "User verified successfully",
      data: user,
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

    console.log("check");
    // check validation
    const { error } = loginEmailValidate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // check if user exists
    const user = await User.findOne({ email }).populate(
      "role_taskId",
      "role permission taskName"
    );

    if (!user) {
      res.status(400);
      throw new Error("User does not exists");
    }
    // check if user is verified
    if (!user.user_verified) {
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
    const access_token = await accessToken(user);
    const refresh_token = await refreshToken(user);

    let checkRefreshToken = await RefreshToken.findOne({ userId: user._id });
    if (!checkRefreshToken) {
      res.status(400);
      throw new Error("No refresh token");
    }

    checkRefreshToken.refreshToken = refresh_token;
    await checkRefreshToken.save();

    let userData = {
      full_name: user.full_name,
      email: user.email,
      houses: user.houses,
      department: user.department,
      designation: user.designation,
      phone_number: user.phone_number,
      gender: user.gender,
      date_of_birth: user.date_of_birth,
      user_image: user.user_image,
      notificationId: user.notificationId,
      role_taskId: user.role_taskId,
      user_verified: user.user_verified,
      _id: user._id,
    };

    await AuditTrail.create({
      userIp: req.ip,
      userId: user._id,
      endPoints: req.originalUrl,
      method: req.method,
      query: req.query,
      message: "User logged in successfully",
      userAgent: req.get("User-Agent"),
      clientSide: req.get("origin"),
      statusCode: res.statusCode,
    });

    // set cookies & send res
    res
      .status(200)
      .cookie("accessToken", access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .cookie("refreshToken", refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({
        success: true,
        message: "User logged in successfully",
        data: userData,
      });
  } catch (error) {
    res.status(500);
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

    // check if refresh token is valid
    const checkStoredToken = await RefreshToken.findOne({
      refreshToken: refresh_token,
    });

    if (!checkStoredToken) {
      res.status(400);
      throw new Error("Refresh token not found");
    }

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

    res.status(200).json({
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
    emailInviteUser(data.email, password);

    // register user
    const user = await User.create({ ...data, user_verified: true });
    if (!user) {
      res.status(400);
      throw new Error("User not registered");
    }

    const role_task = await Role_Task.create({
      userId: user._id,
    });

    if (!role_task) {
      res.status(402);
      await User.findByIdAndDelete(user._id);
      throw new Error("Failed to create user's role & task management.");
    }

    const notification = await Notification.create({
      userId: user._id,
    });

    if (!notification) {
      res.status(402);
      await User.findByIdAndDelete(user._id);
      throw new Error("Failed to create user's notification.");
    }

    user.role_taskId = role_task._id;
    user.notificationId = notification._id;
    await user.save();

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
    // generate access token and refresh token
    const access_token = await accessToken(checkUser);

    // mail the reset password link

    emailReset(email, access_token);

    res.status(200).json({
      success: true,
      message: "Reset password link sent successfully",
      data: ` ${process.env.PROD_CLIENT_URL}/resetPassword/${access_token}`,
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
    const { token, password } = req.body;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized users");
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    if (!decoded) {
      res.status(403);
      throw new Error("Not an authorized token.");
    }

    // if (decoded1.exp > date) {
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Not an user in the database");
    }
    // check if user exists
    const checkUser = await User.findOne({ email: user.email });
    if (!checkUser) {
      res.status(400);
      throw new Error("User does not exists");
    }

    // update password
    checkUser.password = password;
    await checkUser.save();

    // generate access token and refresh token
    const access_token = await accessToken(user);
    const refresh_token = await refreshToken(user);

    let userData = {
      full_name: checkUser.full_name,
      email: checkUser.email,
      houses: checkUser.houses,
      department: checkUser.department,
      designation: checkUser.designation,
      phone_number: checkUser.phone_number,
      gender: checkUser.gender,
      user_image: checkUser.user_image,
      notificationId: checkUser.notificationId,
      role_taskId: checkUser.role_taskId,
      user_verified: checkUser.user_verified,
    };

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

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: userData,
    });
  } catch (error) {
    // An error occurred during JWT verification
    if (error.name === "TokenExpiredError") {
      res.status(403);
      throw new Error("Session Is Expired");
    } else if (error.name === "JsonWebTokenError") {
      res.status(403);
      throw new Error("Not an authorized token.");
    }
    res.status(501);
    throw new Error(error);
  }
});

// @desc    Reset user password via admin
// @route   PUT /api/user/resetAdmin/:id
// @access  Public
const resetUserViaAdmin = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    console.log("check");

    // check if user exists
    const checkUser = await User.findById(req.params.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("User does not exists");
    }

    // update password
    checkUser.password = data.password;
    await checkUser.save();

    let userData = {
      full_name: checkUser.full_name,
      email: checkUser.email,
      houses: checkUser.houses,
      department: checkUser.department,
      designation: checkUser.designation,
      phone_number: checkUser.phone_number,
      gender: checkUser.gender,
      user_image: checkUser.user_image,
      notificationId: checkUser.notificationId,
      role_taskId: checkUser.role_taskId,
      user_verified: checkUser.user_verified,
    };

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: userData,
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
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    // filter the query
    let matchedQuery = {};
    if (id["role_taskId.role"]) {
      matchedQuery["role_taskId.role"] = {
        $regex: id["role_taskId.role"],
        $options: "i",
      };
    }
    if (id.full_name) {
      matchedQuery["full_name"] = {
        $regex: id["full_name"],
        $options: "i",
      };
    }

    // aggregate the result based on query
    let users = await User.aggregate([
      {
        $lookup: {
          from: "role_tasks",
          localField: "role_taskId",
          foreignField: "_id",
          as: "role_taskId",
        },
      },
      {
        $match: matchedQuery,
      },
      {
        $facet: {
          user: [
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    // populate notification and role task
    let populateUser = await User.populate(users[0].user, {
      path: "notificationId",
    });

    if (!users) {
      res.status(400);
      throw new Error("No users found");
    }

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: populateUser || [],
      count: users[0]?.totalCount[0]?.count || 0,
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
    const user = await User.findById(req.params.id, {
      isBlocked: false,
    }).select(
      "_id full_name houses department date_of_birth designation email phone_number gender date_of_birth user_image isBlocked"
    );

    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
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

    // // check if email already exists
    // const { error } = updateUserValidate(data);
    // if (error) {
    //   res.status(400);
    //   throw new Error(error.details[0].message);
    // }

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

    res.status(200).json({
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

    res.status(204).json({
      success: true,
      data: {},
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
    cookieParserMiddleware(req, res, () => {});
    console.log(req.cookies);
    // check if Refresh token is valid
    const refreshToken = req.cookies.refreshToken;

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
      res.status(401);
      throw new Error("Not an authorized token");
    }

    // check if refreshtoken exists
    const checkStoredToken = await RefreshToken.findOne({
      refreshToken: refreshToken,
    });
    if (!checkStoredToken) {
      res.status(400);
      throw new Error("Refresh token not found");
    }

    // check if user exists
    const user = await User.findById(checkStoredToken.userId).populate(
      "role_taskId",
      "role permission"
    );
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    // generate new access token save it
    const access_token = await accessToken(user);

    res
      .status(200)
      .cookie("accessToken", access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({
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

// @desc    Export each user info
// @route   GET /api/user/export
// @access  Admin
const getExportUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {
      // Check if users array is empty
      res.status(400);
      throw new Error("No users found");
    }

    const filePath = path.join(__dirname, "../../exports", "userInfo.json");

    const usersJSON = JSON.stringify(users);

    fs.writeFile(filePath, usersJSON, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        res.status(500).json({
          success: false,
          message: "Error writing to file",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: {
          path: "exports/userInfo.json",
        },
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(501).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @desc    GET all roles which is user
// @route   GET /api/user/roletaskUser
// @access  Admin
const getUserRoleTasks = asyncHandler(async (req, res) => {
  try {
    const users = await Role_Task.find({ role: "User" })
      .populate(
        "userId",
        "full_name email department designation houses phone_number gender date_of_birth user_image"
      )
      .select(
        "_id role permission taskName activity isBlocked createdAt updatedAt full_name email department designation houses phone_number gender date_of_birth user_image"
      );

    res.status(200).json({
      success: true,
      message: "Role & Task fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @desc    Get all roles
// @route   GET /api/user/roletask
// @access  Admin
const getRoleTasks = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;
    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    // define the query in a format
    let matchedQuery = {};
    if (id["userId.full_name"]) {
      matchedQuery["userId.full_name"] = {
        $regex: id["userId.full_name"],
        $options: "i",
      };
    }

    // aggregate to user table to get user info
    let users = await Role_Task.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      {
        $unwind: {
          path: "$userId",
        },
      },
      {
        $match: matchedQuery,
      },
      {
        $facet: {
          roles: [
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Role & Task fetched successfully",
      data: users[0]?.roles || [],
      count: users[0]?.totalCount[0].count || 0,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal server error " + error);
  }
});

// @desc    Get roles based on query
// @route   GET /api/user/roletask/query?role=
// @access  ADMIN
const getRoleTaskOnQuery = asyncHandler(async (req, res) => {
  try {
    const query = req.query.role;
    const roles = await Role_Task.find({ role: query })
      .populate(
        "userId",
        "full_name email department designation houses phone_number gender date_of_birth user_image"
      )
      .select(
        "_id role permission taskName activity isBlocked createdAt updatedAt full_name email department designation houses phone_number gender date_of_birth user_image"
      );
    if (!roles) {
      res.status(400);
      throw new Error("No entries found for provided role " + query);
    }

    res.status(200).json({
      message: "Roles fetched successfully",
      data: roles,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Get a roles
// @route   GET /api/user/roletask/:id
// @access  Admin
const getRoleTaskById = asyncHandler(async (req, res) => {
  try {
    const users = await Role_Task.findById(req.params.id)
      .populate(
        "userId",
        "full_name email department designation houses phone_number gender date_of_birth user_image"
      )
      .select(
        "_id role permission taskName activity isBlocked createdAt updatedAt full_name email department designation houses phone_number gender date_of_birth user_image"
      );
    if (!users || users.length === 0) {
      // Check if users array is empty
      res.status(400);
      throw new Error("No users found");
    }

    res.status(200).json({
      success: true,
      message: "Role & Task fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(501).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @desc    Update a roles
// @route   PUT /api/user/roletask/:id
// @access  Admin
const updateRoleTask = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // check if user exists
    const user = await User.findById(data.userId._id).populate(
      "role_taskId",
      "role permission"
    );
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    const users = await Role_Task.findById(req.params.id);

    if (!users || users.length === 0) {
      // Check if users array is empty
      res.status(400);
      throw new Error("No users found");
    }

    data.userId = data.userId._id;

    const updatedRole = await Role_Task.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedRole) {
      res.status(400);
      throw new Error("Failed to update role");
    }

    // // generate access token and refresh token
    // const access_token = await accessToken(user);
    // const refresh_token = await refreshToken(user);

    // // set cookies
    // res.cookie("accessToken", access_token, {
    //   httpOnly: true, // set true if the client does not need to read it via JavaScript
    //   secure: true, // set to false if not using https
    //   sameSite: "None",
    // });
    // res.cookie("refreshToken", refresh_token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "None",
    // });

    res.status(200).json({
      success: true,
      message: "Role & Task updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(501).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @desc    Create a document for users
// @route   POST /api/user/docs
// @access  Admin
const createUserDocs = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userDoc = req.files;
    let userId = res.locals.userInfo;

    // check if file exists
    if (!userDoc) {
      res.status(400);
      throw new Error("No files provided!");
    }
    data.userDoc = userDoc;

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.createdBy = userId.id;

    // check if the member exists for provided files
    const checkMemberUser = await User.findById(data.userId);
    if (!checkMemberUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    console.log(data);

    // // create a user docs
    // const userData = await UserDocument.create(data);
    // if (!userData) {
    //   res.status(400);
    //   throw new Error("Failed to create a user document!");
    // }

    // res.status(201).json({
    //   success: true,
    //   message: "User document registered!",
    //   data: userData,
    // });
  } catch (error) {
    res.status(500);
    throw new Error("Server error : " + error);
  }
});

// @desc    Get all document of a specific user
// @route   GET /api/user/docs/:id
// @access  Admin
const getUserDocs = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;
    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    let matchedQuery = {};

    // filter the query
    if (id.userId) {
      matchedQuery["userId"] = id.userId;
    }

    // aggregate the results
    let userDocs = await User.aggregate([{}]);
  } catch (error) {
    res.status(500);
    throw new Error("Server error : " + error);
  }
});

// @desc    Update user document using id
// @route   PUT /api/user/docs/:id
// @access  Admin
const updateUserDocs = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userDoc = req.files;
    let userId = res.locals.userInfo;
    let id = req.params.id;

    // check if document exists
    let docExists = await UserDocument.findById(id);
    if (!docExists) {
      res.status(400);
      throw new Error("No document for provided id!");
    }

    //  if file exists update it
    if (userDoc) {
      docExists.userDoc = userDoc;
    }

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

    // check if the member exists for provided files
    const checkMemberUser = await User.findById(data.userId);
    if (!checkMemberUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    // update the document
    let updateDoc = await UserDocument.findByIdAndUpdate(id, docExists, {
      runValidators: true,
      new: true,
    });

    if (!updateDoc) {
      res.status(400);
      throw new Error("Failed to update the user document!");
    }

    res.status(200).json({
      success: true,
      data: updateDoc,
      message: "User document updated!",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error : " + error);
  }
});

// @desc    Delete a user document
// @router  DELETE /api/user/docs/:id
// @access  Admin
const deleteUserDocs = asyncHandler(async (req, res) => {
  try {
    let id = req.params.id;
    let userId = res.locals.userInfo;

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    // check if document exists
    let docExists = await UserDocument.findById(id);
    if (!docExists) {
      res.status(400);
      throw new Error("No document for provided id!");
    }

    // delete the document
    let deleteDoc = await UserDocument.findByIdAndDelete(id);
    if (!docExists) {
      res.status(400);
      throw new Error("Failed to delete the document for provided id!");
    }

    res.status(204).json({
      success: true,
      data: {},
      message: "Document deleted!",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error : " + error);
  }
});

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
  resetUserViaAdmin,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  regenerateAccessToken,
  regenerateRefreshToken,
  getExportUser,
  getRoleTaskOnQuery,
  getUserRoleTasks,
  getRoleTasks,
  getRoleTaskById,
  updateRoleTask,
  createUserDocs,
  getUserDocs,
  updateUserDocs,
  deleteUserDocs,
};
