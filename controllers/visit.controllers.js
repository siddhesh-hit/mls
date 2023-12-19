const asyncHandler = require("express-async-handler");

const Visit = require("../models/Visit");
const Notification = require("../models/notification");

// @desc    Create a count of visit
// @route   /api/visit/
// @access  Public
const visitCount = asyncHandler(async (req, res) => {
  try {
    const id = "6579503547089830865d7f7d";
    const visit = await Visit.findById(id);

    const oldCount = visit.count + 1;
    console.log(oldCount);

    const newCount = await Visit.findByIdAndUpdate(
      { _id: id },
      { count: oldCount }
    );

    if (!newCount) {
      res.status(400);
      throw new Error("Failed to update the count");
    }

    res.status(201).json({
      data: newCount,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all notifications
// @route   /api/visit/notification
// @access  Public
const getAllNotification = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({});

    if (!notifications) {
      res.status(400);
      throw new Error("Failed to get notifications");
    }

    res.status(201).json({
      data: notifications,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  visitCount,
  getAllNotification,
};
