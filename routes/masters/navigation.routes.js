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
  hasPermission,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router
  .route("/")
  .get(
    authMiddleware,
    checkRoleMiddleware([
      "SuperAdmin",
      "Admin",
      "Reviewer",
      "ContentCreator",
      "User",
    ]),
    hasPermission("read"),
    getAllNavigation
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    createNavigation
  );

router
  .route("/:id")
  .get(
    authMiddleware,
    checkRoleMiddleware([
      "SuperAdmin",
      "Admin",
      "Reviewer",
      "ContentCreator",
      "User",
    ]),
    hasPermission("read"),
    getNavigation
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    updateNavigation
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteNavigation
  );

module.exports = router;
