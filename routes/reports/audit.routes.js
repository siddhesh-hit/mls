const router = require("express").Router();

const {
  createAudit,
  getAllAudit,
  getSingleAudit,
  updateAudit,
  deleteAudit,
} = require("../../controllers/reports/audit.controllers");

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
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("read"),
    getAllAudit
  )
  .post(createAudit);

router
  .route("/:id")
  .get(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("read"),
    getSingleAudit
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("update"),
    updateAudit
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteAudit
  );

module.exports = router;
