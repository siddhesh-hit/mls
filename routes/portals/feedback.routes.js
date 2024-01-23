const router = require("express").Router();

const {
  createFeedback,
  getAllFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
} = require("../../controllers/portals/feedback.controllers");

const {
  authMiddleware,
  hasPermission,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router.route("/").get(getAllFeedback).post(createFeedback);

router
  .route("/:id")
  .get(getFeedback)
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("update"),
    updateFeedback
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteFeedback
  );

module.exports = router;
