const router = require("express").Router();

const {
  createHelpdesk,
  getAllHelpdesk,
  getHelpdesk,
  updateHelpdesk,
  deleteHelpdesk,
} = require("../../controllers/portals/helpdesk.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router.route("/").get(getAllHelpdesk).post(createHelpdesk);

router
  .route("/:id")
  .get(getHelpdesk)
  .put(authMiddleware, checkRoleMiddleware(["Admin"]), updateHelpdesk)
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteHelpdesk);

module.exports = router;
