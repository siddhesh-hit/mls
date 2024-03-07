const router = require("express").Router();

const {
  createLegislationPosition,
  getLegislationPosition,
  getLegislationPositions,
  updateLegislationPosition,
  deleteLegislationPosition,
} = require("../../controllers/masters/position.controllers");

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
    getLegislationPositions
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "ContentCreator"]),
    hasPermission("create"),
    createLegislationPosition
  );

router
  .route("/:id")
  .get(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "ContentCreator", "Reviewer"]),
    hasPermission("read"),
    getLegislationPosition
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "ContentCreator"]),
    hasPermission("update"),
    updateLegislationPosition
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Reviewer"]),
    hasPermission("delete"),
    deleteLegislationPosition
  );

module.exports = router;
