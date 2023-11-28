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

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/sabha");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-sabha-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// routes
router
  .route("/")
  .get(getVidhanSabhas)
  .post(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
    upload.fields([
      {
        name: "banner_image",
        maxCount: 1,
      },
      {
        name: "legislative_profile",
        maxCount: 10,
      },
    ]),
    createVidhanSabha
  );

router
  .route("/:id")
  .get(getVidhanSabhaById)
  .put(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
    upload.fields([
      {
        name: "banner_image",
        maxCount: 1,
      },
      {
        name: "legislative_profile",
        maxCount: 10,
      },
    ]),
    updateVidhanSabha
  )
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteVidhanSabha);

module.exports = router;
