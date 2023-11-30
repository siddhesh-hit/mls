const router = require("express").Router();
const {
  createFAQ,
  getAllFAQs,
  getFAQById,
  updateFAQById,
  deleteFAQById,
} = require("../controllers/faq.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../middlewares/authMiddleware");

// routes
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
