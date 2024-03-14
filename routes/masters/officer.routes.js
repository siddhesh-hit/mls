const router = require("express").Router();

const {
  createPresidingOfficer,
  getPresidingOfficer,
  getAllOption,
  getPresidingOfficers,
  updatePresidingOfficer,
  deletePresidingOfficer,
} = require("../../controllers/masters/officer.controllers");

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
    getPresidingOfficers
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "ContentCreator"]),
    hasPermission("create"),
    createPresidingOfficer
  );

router
  .route("/:id")
  .get(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "ContentCreator", "Reviewer"]),
    hasPermission("read"),
    getPresidingOfficer
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "ContentCreator"]),
    hasPermission("update"),
    updatePresidingOfficer
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Reviewer"]),
    hasPermission("delete"),
    deletePresidingOfficer
  );

module.exports = router;
