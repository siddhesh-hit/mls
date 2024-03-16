const router = require("express").Router();
const {
  createMinistry,
  getMinistries,
  getAllOption,
  getMinistry,
  updateMinistry,
  deleteMinistry,
} = require("../../controllers/masters/ministry.controllers");

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
    // checkRoleMiddleware(["SuperAdmin", "Admin", "Reviewer", "ContentCreator"]),
    // hasPermission("read"),
    getMinistries
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    createMinistry
  );

router
  .route("/:id")
  .get(
    // authMiddleware,
    // checkRoleMiddleware(["SuperAdmin", "Admin", "Reviewer", "ContentCreator"]),
    // hasPermission("read"),
    getMinistry
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    updateMinistry
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteMinistry
  );

module.exports = router;
