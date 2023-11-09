const router = require("express").Router();

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
  superAdmin,
  isAdmin,
  isManager,
  isUser,
} = require("../middlewares/authMiddleware");

// routes
router.post("/registerPhone", registerUserPhone);
router.post("/verifyPhone", verifyUserPhone);
router.post("/registerEmail", registerUserEmail);
router.post("/verifyEmail", verifyUserEmail);
router.post("/loginPhone", loginUserPhone);
router.post("/loginEmail", loginUserEmail);
router.post("/logout", logoutUser);
router.get("/", authMiddleware, superAdmin, getUsers);
router.get("/:id", authMiddleware, isUser, getUserById);
router.put("/:id", authMiddleware, isUser, updateUser);
router.delete("/:id", authMiddleware, isUser, deleteUser);

module.exports = router;
