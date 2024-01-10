const router = require("express").Router();
const multer = require("multer");

const {
  createMember,
  getAllMember,
  getMemberHouse,
  getMember,
  updateMember,
  deleteMember,
} = require("../../controllers/portals/member.controllers");
const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/member");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-member-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2000000,
  },
});

// routes
router.get("/house", getMemberHouse);

router
  .route("/")
  .get(getAllMember)
  .post(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
    upload.single("profile"),
    createMember
  );

router
  .route("/:id")
  .get(getMember)
  .put(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
    upload.single("profile"),
    updateMember
  )
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteMember);

module.exports = router;
