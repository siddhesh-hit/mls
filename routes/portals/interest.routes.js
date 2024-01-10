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
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router
  .use("/")
  .get(getAllInterestArea)
  .post(authMiddleware, checkRoleMiddleware(["Admin"]), createInterestArea);

router
  .use("/:id")
  .get(getInterestArea)
  .put(authMiddleware, checkRoleMiddleware(["Admin"]), updateInterestArea)
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteInterestArea);

module.exports = router;
