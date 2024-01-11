const mongoose = require("mongoose");
const router = require("express").Router();

const {
  createNavigation,
  getAllNavigation,
  getNavigation,
  updateNavigation,
  deleteNavigation,
} = require("../../controllers/masters/navigation.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router
  .route("/")
  .get(getAllNavigation)
  .post(authMiddleware, checkRoleMiddleware(["Admin"]), createNavigation);

router
  .route("/:id")
  .get(getNavigation)
  .put(authMiddleware, checkRoleMiddleware(["Admin"]), updateNavigation)
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteNavigation);

module.exports = router;
