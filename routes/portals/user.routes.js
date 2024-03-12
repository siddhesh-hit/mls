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
  resetUserViaAdmin,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  regenerateAccessToken,
  regenerateRefreshToken,
  getExportUser,
  getRoleTaskOnQuery,
  getUserRoleTasks,
  getRoleTasks,
  getRoleTaskById,
  updateRoleTask,
  createUserDocs,
  getUserDocs,
  updateUserDocs,
  deleteUserDocs,
} = require("../../controllers/portals/user.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
  hasPermission,
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

const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/userDocs");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-userDoc-${file.originalname}`);
  },
});

const upload1 = multer({
  storage: storage1,
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
router.put(
  "/resetAdmin/:id",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin"]),
  hasPermission("update"),
  resetUserViaAdmin
);

router.post(
  "/invite",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin", "Admin"]),
  hasPermission("create"),
  upload.single("user_image"),
  inviteUser
);
router.get(
  "/export",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin"]),
  hasPermission("read"),
  getExportUser
);

router.get(
  "/roletaskUser",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin"]),
  hasPermission("read"),
  getUserRoleTasks
);

router.get(
  "/roletask/query",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin"]),
  hasPermission("read"),
  getRoleTaskOnQuery
);

router.get(
  "/roletask",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin"]),
  hasPermission("read"),
  getRoleTasks
);

router.get(
  "/roletask/:id",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin"]),
  hasPermission("read"),
  getRoleTaskById
);

router.put(
  "/roletask/:id",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin"]),
  hasPermission("update"),
  updateRoleTask
);

router.get(
  "/",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin", "Admin"]),
  hasPermission("read"),
  getUsers
);
router.get(
  "/:id",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin", "User", "Admin"]),
  hasPermission("read"),
  getUserById
);
router.put(
  "/:id",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin", "Admin", "User"]),
  hasPermission("update"),
  upload.single("user_image"),
  updateUser
);
router.delete(
  "/:id",
  authMiddleware,
  checkRoleMiddleware(["SuperAdmin", "Admin", "User"]),
  hasPermission("delete"),
  deleteUser
);
router.post("/accessToken", regenerateAccessToken);
router.post("/refreshToken", regenerateRefreshToken);

router
  .route("/docs")
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin"]),
    hasPermission("upload"),
    upload1.single("userDoc"),
    createUserDocs
  );

router
  .route("/docs/:id")
  .get(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin"]),
    hasPermission("read"),
    getUserDocs
  )
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin"]),
    hasPermission("update"),
    upload1.single("userDoc"),
    updateUserDocs
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin"]),
    hasPermission("delete"),
    deleteUserDocs
  );
module.exports = router;
