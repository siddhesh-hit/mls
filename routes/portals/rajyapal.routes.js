const router = require("express").Router();
const multer = require("multer");

const {
  getALLLegislativeMembers,
  getLegislativeMemberById,
  getActiveLegislativeMember,
  getCurrentLegislativeMember,
  createLegislativeMember,
  updateLegislativeMember,
  deleteLegislativeMember,
} = require("../../controllers/portals/rajyapal.controllers");

const {
  authMiddleware,
  hasPermission,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/rajyapal");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-rajyapal-${file.originalname}`);
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 3000000 } });

// routes
router.get("/active", getActiveLegislativeMember);
router.get("/current", getCurrentLegislativeMember);

router
  .route("/")
  .get(getALLLegislativeMembers)
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    upload.fields([
      { name: "documents", maxCount: 15 },
      {
        name: "banner",
        maxCount: 5,
      },
    ]),
    createLegislativeMember
  );

router
  .route("/:id")
  .get(getLegislativeMemberById)
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    upload.fields([
      { name: "documents", maxCount: 15 },
      {
        name: "banner",
        maxCount: 5,
      },
    ]),
    updateLegislativeMember
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteLegislativeMember
  );

module.exports = router;
