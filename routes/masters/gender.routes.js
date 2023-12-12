const router = require("express").Router();
const {
  createGender,
  getAllGender,
  getGender,
  updateGender,
  deleteGender,
} = require("../../controllers/masters/gender.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router
  .route("/")
  .get(getAllGender)
  .post(authMiddleware, checkRoleMiddleware(["Admin"]), createGender);

router
  .route("/:id")
  .get(getGender)
  .put(authMiddleware, checkRoleMiddleware(["Admin"]), updateGender)
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteGender);

module.exports = router;
