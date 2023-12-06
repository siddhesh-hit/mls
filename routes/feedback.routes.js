const router = require("express").Router();

const {
  createFeedback,
  getAllFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedback.controllers");
const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../middlewares/authMiddleware");

// routes
router.route("/").get(getAllFeedback).post(createFeedback);

router
  .route("/:id")
  .get(getFeedback)
  .put(authMiddleware, checkRoleMiddleware(["Admin"]), updateFeedback)
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteFeedback);

module.exports = router;
