const router = require("express").Router();
const {
  createConstituency,
  getAllConstituency,
  getConstituency,
  updateConstituency,
  deleteConstituency,
} = require("../../controllers/masters/constituency.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router
  .route("/")
  .get(getAllConstituency)
  .post(authMiddleware, checkRoleMiddleware(["Admin"]), createConstituency);

router
  .route("/:id")
  .get(getConstituency)
  .put(authMiddleware, checkRoleMiddleware(["Admin"]), updateConstituency)
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteConstituency);

module.exports = router;
