const router = require("express").Router();
const multer = require("multer");

const {
  getVidhanParishads,
  getVidhanParishadById,
  createVidhanParishad,
  updateVidhanParishad,
  deleteVidhanParishad,
} = require("../controllers/parishad.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../middlewares/authMiddleware");

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/parishad");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}-parishad`);
  },
});

const upload = multer({ storage: storage });

// routes

router
  .route("/")
  .get(getVidhanParishads)
  .post(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
    upload.fields([
      {
        name: "banner_image_en",
        maxCount: 1,
      },
      {
        name: "banner_image_mr",
        maxCount: 1,
      },
    ]),
    createVidhanParishad
  );

router
  .route("/:id")
  .get(getVidhanParishadById)
  .put(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
    upload.fields([
      {
        name: "banner_image_en",
        maxCount: 1,
      },
      {
        name: "banner_image_mr",
        maxCount: 1,
      },
    ]),
    updateVidhanParishad
  )
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteVidhanParishad);

module.exports = router;
