const router = require("express").Router();
const multer = require("multer");

const {
  registerUserPhone,
  verifyUserPhone,
  registerUserEmail,
  verifyUserEmail,
  loginUserPhone,
  loginUserEmail,
  inviteUser,
  forgotUser,
  resetUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  regenerateAccessToken,
  regenerateRefreshToken,
} = require("../controllers/user.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../middlewares/authMiddleware");

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/users");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-users-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// routes
router.post("/registerPhone", registerUserPhone);
router.post("/verifyPhone", verifyUserPhone);
router.post("/registerEmail", upload.single("user_image"), registerUserEmail);
router.post("/verifyEmail", verifyUserEmail);
router.post("/loginPhone", loginUserPhone);
router.post("/loginEmail", loginUserEmail);
router.post("/forgot", forgotUser);
router.post("/reset", resetUser);
router.post(
  "/invite",
  // authMiddleware,
  // checkRoleMiddleware("Admin"),
  upload.single("user_image"),
  inviteUser
);
router.get(
  "/",
  authMiddleware,
  checkRoleMiddleware("Super Admin", "User"),
  getUsers
);
router.get("/:id", authMiddleware, checkRoleMiddleware("User"), getUserById);
router.put(
  "/:id",
  authMiddleware,
  checkRoleMiddleware("Manager"),
  upload.single("user_image"),
  updateUser
);
router.delete("/:id", authMiddleware, checkRoleMiddleware("User"), deleteUser);
router.post("/accessToken", authMiddleware, regenerateAccessToken);
router.post("/refreshToken", authMiddleware, regenerateRefreshToken);

module.exports = router;
