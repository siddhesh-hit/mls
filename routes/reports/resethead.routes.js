const router = require("express").Router();

const {
  createResetHead,
  getAllResetHead,
  getSingleResetHead,
  updateResetHead,
  deleteResetHead,
  retrieveResetHead,
} = require("../../controllers/reports/resethead.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
  hasPermission,
} = require("../../middlewares/authMiddleware");

// routes
router.post(
  "/retrieve",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin"]),
  hasPermission("create"),
  retrieveResetHead
);

router
  .route("/")
  .get(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin"]),
    hasPermission("read"),
    getAllResetHead
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin"]),
    hasPermission("create"),
    createResetHead
  );

router
  .route("/:id")
  .get(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin"]),
    hasPermission("read"),
    getSingleResetHead
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin"]),
    hasPermission("update"),
    updateResetHead
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin"]),
    hasPermission("delete"),
    deleteResetHead
  );

module.exports = router;
