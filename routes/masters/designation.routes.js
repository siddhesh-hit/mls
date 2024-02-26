const router = require("express").Router();

const {
  createDesignation,
  getDesignation,
  getDesignations,
  updateDesignation,
  deleteDesignation,
} = require("../../controllers/masters/designation.controllers");

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
    checkRoleMiddleware(["SuperAdmin", "ContentCreator", "Reviewer"]),
    hasPermission("read"),
    getDesignations
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "ContentCreator"]),
    hasPermission("create"),
    createDesignation
  );

router
  .route("/:id")
  .get(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "ContentCreator", "Reviewer"]),
    hasPermission("read"),
    getDesignation
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "ContentCreator"]),
    hasPermission("update"),
    updateDesignation
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Reviewer"]),
    hasPermission("delete"),
    deleteDesignation
  );

module.exports = router;
