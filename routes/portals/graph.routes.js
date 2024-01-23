const router = require("express").Router();

const {
  getAllMemberGraphs,
  getMemberGraphById,
  getActiveMemberGraph,
  createMemberGraph,
  updateMemberGraph,
  deleteMemberGraph,
} = require("../../controllers/portals/graph.controllers");

const {
  authMiddleware,
  hasPermission,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router.get("/active", getActiveMemberGraph);

router
  .route("/")
  .get(getAllMemberGraphs)
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    createMemberGraph
  );

router
  .route("/:id")
  .get(getMemberGraphById)
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    updateMemberGraph
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteMemberGraph
  );

module.exports = router;
