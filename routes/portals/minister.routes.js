const router = require("express").Router();

const {
  createMinister,
  getMinister,
  getAMinister,
  updateMinister,
  deleteMinister,
} = require("../../controllers/portals/minister.controllers");

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
    checkRoleMiddleware(["SuperAdmin", "Admin", "Reviewer"]),
    hasPermission("read"),
    getMinister
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    createMinister
  );

router
  .route("/:id")
  .get(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "Reviewer"]),
    hasPermission("read"),
    getAMinister
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    updateMinister
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteMinister
  );

module.exports = router;
