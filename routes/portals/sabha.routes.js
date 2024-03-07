const router = require("express").Router();
const multer = require("multer");

const {
  getVidhanSabhas,
  getActiveVidhanSabha,
  getVidhanSabhaById,
  createVidhanSabha,
  updateVidhanSabha,
  deleteVidhanSabha,
} = require("../../controllers/portals/sabha.controllers");

const {
  authMiddleware,
  hasPermission,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/sabha");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-sabha-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2000000, // 1000000 Bytes = 1 MB
  },
});

// routes
router.get("/active", getActiveVidhanSabha);
router
  .route("/")
  .get(getVidhanSabhas)
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    upload.fields([
      {
        name: "banner_image",
        maxCount: 1,
      },
      {
        name: "legislative_profile",
        maxCount: 10,
      },
      {
        name: "publication_docs_en",
        maxCount: 5,
      },
      {
        name: "publication_docs_mr",
        maxCount: 5,
      },
      {
        name: "profile",
        maxCount: 1,
      },
    ]),
    createVidhanSabha
  );

router
  .route("/:id")
  .get(getVidhanSabhaById)
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    upload.fields([
      {
        name: "banner_image",
        maxCount: 1,
      },
      {
        name: "legislative_profile",
        maxCount: 10,
      },
      {
        name: "publication_docs_en",
        maxCount: 5,
      },
      {
        name: "publication_docs_mr",
        maxCount: 5,
      },
      {
        name: "profile",
        maxCount: 1,
      },
    ]),
    updateVidhanSabha
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteVidhanSabha
  );

module.exports = router;
