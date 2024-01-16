const router = require("express").Router();

const {
  createNotificationFormat,
  updateNotification,
  getAllNotification,
  getNotification,
} = require("../../controllers/extras/notification.controllers");

// routes
router.route("/").get(getAllNotification).post(createNotificationFormat);
router.route("/:id").get(getNotification).put(updateNotification);

module.exports = router;
