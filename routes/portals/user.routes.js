const router = require("express").Router();
const multer = require("multer");

const {
  registerUserPhone,
  verifyUserPhone,
  registerUserEmail,
  verifyUserEmail,
  loginUserPhone,
  loginUserEmail,
  logoutUser,
  inviteUser,
  forgotUser,
  resetUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  regenerateAccessToken,
  regenerateRefreshToken,
} = require("../../controllers/portals/user.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/users");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-users-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2000000, // 1000000 Bytes = 1 MB
  },
});

// routes
router.post("/registerPhone", registerUserPhone);
router.post("/verifyPhone", verifyUserPhone);
router.post("/registerEmail", upload.single("user_image"), registerUserEmail);
router.post("/verifyEmail", verifyUserEmail);
router.post("/loginPhone", loginUserPhone);
router.post("/loginEmail", loginUserEmail);
router.post("/logout", authMiddleware, logoutUser);
router.post("/forgot", forgotUser);
router.post("/reset", resetUser);
router.post(
  "/invite",
  authMiddleware,
  checkRoleMiddleware(["Admin"]),
  upload.single("user_image"),
  inviteUser
);
router.get("/", authMiddleware, checkRoleMiddleware(["Admin"]), getUsers);
router.get("/:id", authMiddleware, checkRoleMiddleware(["Admin"]), getUserById);
router.put(
  "/:id",
  authMiddleware,
  checkRoleMiddleware(["Admin"]),
  upload.single("user_image"),
  updateUser
);
router.delete(
  "/:id",
  authMiddleware,
  checkRoleMiddleware(["User"]),
  deleteUser
);
router.post("/accessToken", regenerateAccessToken);
router.post("/refreshToken", regenerateRefreshToken);

module.exports = router;