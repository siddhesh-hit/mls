const router = require("express").Router();

const {
  createPending,
  getAllRequest,
  getSingleRequest,
  updatePendingCreate,
  updatePendingDelete,
  updatePendingUpdate,
  deletePending,
} = require("../../controllers/reports/pending.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
  hasPermission,
} = require("../../middlewares/authMiddleware");

// routes

router.put(
  "/updatePost/:id",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin", "ContentCreator"]),
  hasPermission("update"),
  updatePendingCreate
);

router.put(
  "/updatePut/:id",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin", "ContentCreator"]),
  hasPermission("update"),
  updatePendingUpdate
);

router.put(
  "/updateDel/:id",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin", "ContentCreator"]),
  hasPermission("update"),
  updatePendingDelete
);

router
  .route("/")
  .get(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "Reviewer", "ContentCreator"]),
    hasPermission("read"),
    getAllRequest
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "ContentCreator"]),
    hasPermission("create"),
    createPending
  );

router
  .route("/:id")
  .get(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "Reviewer", "ContentCreator"]),
    hasPermission("read"),
    getSingleRequest
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deletePending
  );

module.exports = router;
