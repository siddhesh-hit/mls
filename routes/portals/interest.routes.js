const router = require("express").Router();

const {
  createInterestArea,
  getAllInterestArea,
  getInterestArea,
  updateInterestArea,
  deleteInterestArea,
} = require("../../controllers/portals/interest.controllers");

const {
  authMiddleware,
  hasPermission,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router.route("/").get(getAllInterestArea).post(createInterestArea);

router
  .route("/:id")
  .get(getInterestArea)
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("update"),
    updateInterestArea
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteInterestArea
  );

module.exports = router;
