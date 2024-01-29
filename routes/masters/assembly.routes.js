const router = require("express").Router();
const {
  createAssembly,
  getAllAssembly,
  getAssembly,
  updateAssembly,
  deleteAssembly,
} = require("../../controllers/masters/assembly.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
  hasPermission,
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
    getAllAssembly
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    createAssembly
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
    getAssembly
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    updateAssembly
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteAssembly
  );

module.exports = router;
