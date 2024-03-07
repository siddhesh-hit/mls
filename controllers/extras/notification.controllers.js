const asyncHandler = require("express-async-handler");

const Notification = require("../../models/extras/Notification");
const NotificationFormat = require("../../models/extras/NotificationFormat");
const User = require("../../models/portals/userModel");

// @desc    Create notification format
const createNotificationFormat = asyncHandler(async (notificationData, res) => {
  try {
    // check if name & message exist
    if (
      !notificationData.name ||
      !notificationData.marathi.message ||
      !notificationData.english.message
    ) {
      throw new Error("Fill the data properly.");
    }

    // check if notification exists and update
    const checkNotification = await NotificationFormat.findOne({
      name: notificationData.name,
    });
    if (checkNotification) {
      await NotificationFormat.findByIdAndUpdate(
        checkNotification._id,
        notificationData,
        { new: true, runValidators: true }
      );
      return;
    }

    // create new Notification
    const createNotification = await NotificationFormat.create(
      notificationData
    );
    // if (createNotification) {
    //   res.status(201).json({
    //     data: createNotification,
    //     success: true,
    //   });
    // }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Create notification
const createNotification = asyncHandler(async (req, res) => {
  try {
    let userId = req.body.userId;

    const checkUser = await User.findById({ _id: userId });
    if (checkUser) {
      res.status(402);
      throw new Error("No user found for provided id.");
    }

    await Notification.create({
      userId,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update notification
const updateNotification = asyncHandler(async (notificationData, id, res) => {
  try {
    // check if name & message exist
    if (
      !notificationData.name ||
      !notificationData.marathi.messageMr ||
      !notificationData.english.messageEn
    ) {
      throw new Error("Fill the data properly.");
    }

    // check if notification exists and update
    const checkNotification = await Notification.findOne({ _id: id });

    let data = {
      userId: checkNotification.userId,
      user_specific: checkNotification.user_specific,
      global: checkNotification.global,
      isRead: checkNotification.isRead,
    };

    let check = data.user_specific.some(
      (ele) => ele.name === notificationData.name
    );

    if (check) {
      data.user_specific.map((ele) => {
        if (ele.name === name) {
          ele.name = notificationData.name;
          ele.english.message = notificationData.marathi.messageMr;
          ele.english.message = notificationData.english.messageEn;
        }
        return ele;
      });
    } else {
      data.user_specific.push(notificationData);
    }

    if (checkNotification) {
      await Notification.findByIdAndUpdate(checkNotification._id, data, {
        new: true,
        runValidators: true,
      });
      return;
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all notifications
// @route   GET /api/visit/notification
// @access  Admin
const getAllNotification = asyncHandler(async (req, res) => {
  try {
    const notifications = await NotificationFormat.find({}).distinct("_id");

    if (!notifications) {
      res.status(400);
      throw new Error("Failed to get notifications");
    }

    res.status(200).json({
      data: notifications,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a notification
// @route   GET /api/visit/notification/:id
// @access  Public
const getNotification = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.findById(req.params.id).populate("global");

    if (!notifications) {
      res.status(400);
      throw new Error("Failed to get notifications");
    }

    res.status(200).json({
      data: notifications,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createNotificationFormat,
  createNotification,
  updateNotification,
  getAllNotification,
  getNotification,
};
