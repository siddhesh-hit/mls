const router = require("express").Router();

const {
  createDesignation,
  getDesignation,
  getAllOption,
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
router.get("/option", getAllOption);

router
  .route("/")
  .get(
    // authMiddleware,
    // checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator", "Reviewer"]),
    // hasPermission("read"),
    getDesignations
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    createDesignation
  );

router
  .route("/:id")
  .get(
    // authMiddleware,
    // checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator", "Reviewer"]),
    // hasPermission("read"),
    getDesignation
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    updateDesignation
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "Reviewer"]),
    hasPermission("delete"),
    deleteDesignation
  );

module.exports = router;
