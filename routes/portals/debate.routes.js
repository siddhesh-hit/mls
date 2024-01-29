const router = require("express").Router();
const {
  createDebate,
  getAllDebates,
  getDebateSearch,
  getDebateById,
  getHouseDebates,
  updateDebateById,
  deleteDebateById,
} = require("../../controllers/portals/debate.controllers");

const {
  authMiddleware,
  hasPermission,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router.get("/houses", getHouseDebates);
router.get("/search", getDebateSearch);

router
  .route("/")
  .get(getAllDebates)
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    createDebate
  );

router
  .route("/:id")
  .get(getDebateById)
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    updateDebateById
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteDebateById
  );

module.exports = router;
