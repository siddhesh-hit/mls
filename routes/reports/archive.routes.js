const router = require("express").Router();

const {
  createArchive,
  createArchiveApi,
  getAllArchive,
  getSingleArchive,
  updateArchive,
  deleteArchive,
} = require("../../controllers/reports/archive.controllers");

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
    checkRoleMiddleware(["SuperAdmin"]),
    hasPermission("read"),
    getAllArchive
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin"]),
    hasPermission("create"),
    createArchiveApi
  );

router
  .route("/:id")
  .get(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin"]),
    hasPermission("read"),
    getSingleArchive
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin"]),
    hasPermission("update"),
    updateArchive
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin"]),
    hasPermission("delete"),
    deleteArchive
  );

module.exports = router;
