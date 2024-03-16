const router = require("express").Router();

const {
  createLegislationPosition,
  getLegislationPosition,
  getLegislationPositions,
  getAllOption,
  updateLegislationPosition,
  deleteLegislationPosition,
} = require("../../controllers/masters/position.controllers");

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
    getLegislationPositions
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    createLegislationPosition
  );

router
  .route("/:id")
  .get(
    // authMiddleware,
    // checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator", "Reviewer"]),
    // hasPermission("read"),
    getLegislationPosition
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    updateLegislationPosition
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "Reviewer"]),
    hasPermission("delete"),
    deleteLegislationPosition
  );

module.exports = router;
