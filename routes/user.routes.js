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
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
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
router.post("/logout", logoutUser);
router.get(
  "/",
  authMiddleware,
  checkRoleMiddleware(["Super Admin", "User"]),
  getUsers
);
router.get("/:id", authMiddleware, checkRoleMiddleware(["User"]), getUserById);
router.put(
  "/:id",
  authMiddleware,
  checkRoleMiddleware(["Manager"]),
  updateUser
);
router.delete(
  "/:id",
  authMiddleware,
  checkRoleMiddleware(["User"]),
  deleteUser
);

module.exports = router;
