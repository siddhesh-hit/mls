const router = require("express").Router();
const multer = require("multer");

const {
  getALLLegislativeMembers,
  getLegislativeMemberById,
  getActiveLegislativeMember,
  createLegislativeMember,
  updateLegislativeMember,
  deleteLegislativeMember,
} = require("../controllers/rajyapal.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../middlewares/authMiddleware");

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

router
  .route("/")
  .get(getALLLegislativeMembers)
  .post(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
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
    checkRoleMiddleware(["Admin"]),
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
    checkRoleMiddleware(["Admin"]),
    deleteLegislativeMember
  );

module.exports = router;
