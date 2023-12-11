const router = require("express").Router();
const {
  createAssembly,
  getAllAssembly,
  getAssembly,
  updateAssembly,
  deleteAssembly,
} = require("../../controllers/masters/constituency.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../middlewares/authMiddleware");

// routes
router
  .route("/")
  .get(getAllAssembly)
  .post(authMiddleware, checkRoleMiddleware(["Admin"]), createAssembly);

router
  .route("/:id")
  .get(getAssembly)
  .put(authMiddleware, checkRoleMiddleware(["Admin"]), updateAssembly)
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteAssembly);

module.exports = router;
