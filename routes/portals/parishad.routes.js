const router = require("express").Router();
const multer = require("multer");

const {
  getVidhanParishads,
  getActiveVidhanParishad,
  getVidhanParishadById,
  createVidhanParishad,
  updateVidhanParishad,
  deleteVidhanParishad,
} = require("../../controllers/portals/parishad.controllers");

const {
  authMiddleware,
  hasPermission,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/parishad");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-parishad-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2000000, // 1000000 Bytes = 1 MB
  },
});

// routes
router.get(
  "/active",

  getActiveVidhanParishad
);

router
  .route("/")
  .get(getVidhanParishads)
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
    createVidhanParishad
  );

router
  .route("/:id")
  .get(getVidhanParishadById)
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
    updateVidhanParishad
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteVidhanParishad
  );

module.exports = router;
