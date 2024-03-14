const router = require("express").Router();

const {
  createSessionField,
  getSessionField,
  getSessionFields,
  getAllOption,
  updateSessionField,
  deleteSessionField,
} = require("../../controllers/masters/session.controllers");

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
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "ContentCreator", "Reviewer"]),
    hasPermission("read"),
    getSessionFields
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "ContentCreator"]),
    hasPermission("create"),
    createSessionField
  );

router
  .route("/:id")
  .get(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "ContentCreator", "Reviewer"]),
    hasPermission("read"),
    getSessionField
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "ContentCreator"]),
    hasPermission("update"),
    updateSessionField
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Reviewer"]),
    hasPermission("delete"),
    deleteSessionField
  );

module.exports = router;
