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
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// routes
router.get("/active", getActiveFaq);

router
  .route("/")
  .get(getAllFAQs)
  .post(authMiddleware, checkRoleMiddleware(["Admin"]), createFAQ);

router
  .route("/:id")
  .get(getFAQById)
  .put(authMiddleware, checkRoleMiddleware(["Admin"]), updateFAQById)
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteFAQById);

module.exports = router;
