const router = require("express").Router();
const multer = require("multer");

const {
  createSession,
  getAllSession,
  getSession,
  updateSession,
  deleteSession,
} = require("../../controllers/portals/session.controllers");

const {
  authMiddleware,
  hasPermission,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/session");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-session-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2000000, // 1000000 Bytes = 1 MB
  },
});

// routes
router
  .route("/")
  .get(getAllSession)
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    upload.fields([
      {
        name: "document",
        maxCount: 10,
      },
    ]),
    createSession
  );

router
  .route("/:id")
  .get(getSession)
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    upload.fields([
      {
        name: "document",
        maxCount: 10,
      },
    ]),
    updateSession
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteSession
  );

module.exports = router;
