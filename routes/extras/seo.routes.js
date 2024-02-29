const router = require("express").Router();

const {
  createSEO,
  getAllSEO,
  getSEOById,
  getSEOByPage,
  updateSEO,
  DeleteById,
} = require("../../controllers/extras/seo.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
  hasPermission,
} = require("../../middlewares/authMiddleware");

// routes
router.get("/page", getSEOByPage);
router
  .route("/")
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    createSEO
  )
  .get(getAllSEO);

router
  .route("/:id")
  .get(getSEOById)
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    updateSEO
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    DeleteById
  );

module.exports = router;
