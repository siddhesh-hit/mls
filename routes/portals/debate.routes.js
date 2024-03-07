const router = require("express").Router();
const {
  createDebate,
  getAllDebates,
  getDebateSearch,
  getDebateById,
  getHouseDebates,
  getMemberDebateSearch,
  getDebateFullSearch,
  updateDebateById,
  deleteDebateById,
  getDebateFilterOption,
  getDebateMethodFilterOption,
} = require("../../controllers/portals/debate.controllers");

const {
  authMiddleware,
  hasPermission,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes

router.get("/houses", getHouseDebates);
router.get("/search", getDebateSearch);
router.get("/member", getMemberDebateSearch);
router.get("/fields", getDebateFullSearch);
router.get("/postgresFields", getpostDebateFullSearch);

router.get("/postgres", getpostAllDebates);

// options
router.get("/option", getDebateFilterOption);

// basic crud
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
