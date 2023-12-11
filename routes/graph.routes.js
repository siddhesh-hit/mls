const router = require("express").Router();

const {
  getAllMemberGraphs,
  getMemberGraphById,
  getActiveMemberGraph,
  createMemberGraph,
  updateMemberGraph,
  deleteMemberGraph,
} = require("../controllers/graph.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../middlewares/authMiddleware");

// routes
router.get("/active", getActiveMemberGraph);

router
  .route("/")
  .get(getAllMemberGraphs)
  .post(authMiddleware, checkRoleMiddleware("Admin"), createMemberGraph);

router
  .route("/:id")
  .get(getMemberGraphById)
  .put(authMiddleware, checkRoleMiddleware("Admin"), updateMemberGraph)
  .delete(authMiddleware, checkRoleMiddleware("Admin"), deleteMemberGraph);

module.exports = router;
