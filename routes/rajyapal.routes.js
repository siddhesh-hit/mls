const router = require("express").Router();
const multer = require("multer");

const {
  getALLLegislativeMembers,
  getLegislativeMemberById,
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
  .put(updateLegislativeMember, authMiddleware, checkRoleMiddleware(["Admin"]))
  .delete(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
    upload.fields([
      { name: "documents", maxCount: 15 },
      {
        name: "banner",
        maxCount: 5,
      },
    ]),
    deleteLegislativeMember
  );

module.exports = router;
