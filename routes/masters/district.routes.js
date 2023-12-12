const router = require("express").Router();
const {
  createDistrict,
  getAllDistrict,
  getDistrict,
  updateDistrict,
  deleteDistrict,
} = require("../../controllers/masters/district.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router
  .route("/")
  .get(getAllDistrict)
  .post(authMiddleware, checkRoleMiddleware(["Admin"]), createDistrict);

router
  .route("/:id")
  .get(getDistrict)
  .put(authMiddleware, checkRoleMiddleware(["Admin"]), updateDistrict)
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteDistrict);

module.exports = router;
