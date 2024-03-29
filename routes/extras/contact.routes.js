const router = require("express").Router();

const {
  createContact,
  getContact,
  getContacts,
  updateContact,
  deleteContact,
} = require("../../controllers/extras/contact.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
  hasPermission,
} = require("../../middlewares/authMiddleware");

// routes
router
  .route("/")
  .get(getContacts)
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    createContact
  );

router
  .route("/:id")
  .get(getContact)
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    updateContact
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "Reviewer"]),
    hasPermission("delete"),
    deleteContact
  );

module.exports = router;
