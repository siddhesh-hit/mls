const router = require("express").Router();
const multer = require("multer");

const {
  createMember,
  getAllMember,
  getMemberHouse,
  getMemberSearch,
  getMember,
  updateMember,
  deleteMember,
  getAllMemberDetails,
  getDebateFilterOption,
} = require("../../controllers/portals/member.controllers");
const {
  authMiddleware,
  hasPermission,
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
router.get("/search", getMemberSearch);
router.get("/option", getDebateFilterOption);

router
  .route("/")
  .get(getAllMember)
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    upload.single("profile"),
    createMember
  );
router
  .route("/memberdetails")
  .get(getAllMemberDetails)
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    upload.single("profile"),
    createMember
  );

router
  .route("/:id")
  .get(getMember)
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    upload.single("profile"),
    updateMember
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteMember
  );

module.exports = router;
