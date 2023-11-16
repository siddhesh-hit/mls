const router = require("express").Router();
const multer = require("multer");

const {
  getVidhanSabhas,
  getVidhanSabhaById,
  createVidhanSabha,
  updateVidhanSabha,
  deleteVidhanSabha,
} = require("../controllers/sabha.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../middlewares/authMiddleware");

// multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/sabha");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// routes
router.get("/", getVidhanSabhas);
router.get("/:id", getVidhanSabhaById);
router.post(
  "/",
  authMiddleware,
  checkRoleMiddleware(["admin"]),
  createVidhanSabha
);
router.put(
  "/:id",
  authMiddleware,
  checkRoleMiddleware(["admin"]),
  updateVidhanSabha
);
router.delete(
  "/:id",
  authMiddleware,
  checkRoleMiddleware(["admin"]),
  deleteVidhanSabha
);

module.exports = router;
