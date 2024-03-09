const router = require("express").Router();
const {
  createFAQ,
  getActiveFaq,
  getAllFAQs,
  getFAQById,
  updateFAQById,
  deleteFAQById,
} = require("../../controllers/portals/faq.controllers");

const {
  authMiddleware,
  hasPermission,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router.get(
  "/active",

  getActiveFaq
);

router
  .route("/")
  .get(getAllFAQs)
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    createFAQ
  );

router
  .route("/:id")
  .get(getFAQById)
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    updateFAQById
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteFAQById
  );

module.exports = router;
