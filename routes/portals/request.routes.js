const router = require("express").Router();

const {
  createRequestAccess,
  getAllRequestAccess,
  getRequestAccess,
  updateRequestAccess,
  deleteRequestAccess,
} = require("../../controllers/portals/request.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router
  .use("/")
  .get(getAllRequestAccess)
  .post(authMiddleware, checkRoleMiddleware(["Admin"]), createRequestAccess);

router
  .use("/:id")
  .get(getRequestAccess)
  .put(authMiddleware, checkRoleMiddleware(["Admin"]), updateRequestAccess)
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteRequestAccess);

module.exports = router;
