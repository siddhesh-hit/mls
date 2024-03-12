const router = require("express").Router();
const {
  createGender,
  getAllGender,
  getGender,
  updateGender,
  deleteGender,
} = require("../../controllers/masters/gender.controllers");

const {
  authMiddleware,
  hasPermission,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router
  .route("/")
  .get(
    // authMiddleware,
    // checkRoleMiddleware([
    //   "SuperAdmin",
    //   "Admin",
    //   "Reviewer",
    //   "ContentCreator",
    //   "User",
    // ]),
    // hasPermission("read"),
    getAllGender
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    createGender
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
    getGender
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    updateGender
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteGender
  );

module.exports = router;
