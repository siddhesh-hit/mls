const router = require("express").Router();

const {
  createRequestAccess,
  getAllRequestAccess,
  getRequestAccess,
  updateRequestAccess,
  deleteRequestAccess,
} = require("../../controllers/portals/request.controllers");

const {
  authMiddleware,
  hasPermission,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router.route("/").get(getAllRequestAccess).post(createRequestAccess);

router
  .route("/:id")
  .get(getRequestAccess)
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("update"),
    updateRequestAccess
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteRequestAccess
  );

module.exports = router;
