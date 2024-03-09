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
  hasPermission,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router.route("/").get(getAllHelpdesk).post(createHelpdesk);

router
  .route("/:id")
  .get(getHelpdesk)
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("update"),
    updateHelpdesk
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteHelpdesk
  );

module.exports = router;
