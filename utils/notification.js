const asyncHandler = require("express-async-handler");
const Notification = require("../models/portals/notification");

// @desc    Generate a notification for each module updated
const notificationGenerator = asyncHandler(
  async (name, messageMr, messageEn, res) => {
    console.log(name, messageMr, messageEn);
    try {
      // check if name & message exist
      if (!name || !messageMr || !messageEn) {
        throw new Error("Fill the data properly.");
      }

      // check if notification exists and delete
      const checkNotification = await Notification.findOne({ name });
      if (checkNotification) {
        await Notification.findByIdAndDelete(checkNotification._id);
      }

      // create new Notification
      const createNotification = await Notification.create({
        name,
        marathi: { message: messageMr },
        english: { message: messageEn },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = notificationGenerator;
