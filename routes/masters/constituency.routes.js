const router = require("express").Router();
const {
  createConstituency,
  getAllConstituency,
  getConstituency,
  updateConstituency,
  deleteConstituency,
} = require("../../controllers/masters/constituency.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
  hasPermission,
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
    getAllConstituency
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    createConstituency
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
    getConstituency
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    updateConstituency
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteConstituency
  );

module.exports = router;
