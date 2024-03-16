const router = require("express").Router();
const {
  createConstituency,
  getAllConstituency,
  getAllOption,
  getConstituency,
  updateConstituency,
  deleteConstituency,
} = require("../../controllers/masters/constituency.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
  hasPermission,
} = require("../../middlewares/authMiddleware");

// routes
router.get("/option", getAllOption);

router
  .route("/")
  .get(
    // authMiddleware,
    // checkRoleMiddleware([
    //   "SuperAdmin",
    //   "Admin",
    //   "Reviewer",a
    //   "ContentCreator",
    //   "User",
    // ]),
    // hasPermission("read"),
    getAllConstituency
  )
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    createConstituency
  );

router
  .route("/:id")
  .get(
    authMiddleware,
    checkRoleMiddleware([
      "SuperAdmin",
      "Admin",
      "Reviewer",
      "ContentCreator",
      "User",
    ]),
    hasPermission("read"),
    getConstituency
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    updateConstituency
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteConstituency
  );

module.exports = router;
