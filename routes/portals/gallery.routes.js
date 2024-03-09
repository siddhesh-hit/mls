const router = require("express").Router();
const multer = require("multer");

const {
  getAllMandalGalleries,
  getMandalGalleryById,
  createMandalGallery,
  updateMandalGallery,
  deleteMandalGallery,
} = require("../../controllers/portals/gallery.controllers");

const {
  authMiddleware,
  hasPermission,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/mandal");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-mandal-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2000000, // 1000000 Bytes = 1 MB
  },
});

// routes
router
  .route("/")
  .get(getAllMandalGalleries)
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    upload.fields([{ name: "gallery_image", maxCount: 10 }]),
    createMandalGallery
  );

router
  .route("/:id")
  .get(getMandalGalleryById)
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    upload.fields([{ name: "gallery_image", maxCount: 10 }]),
    updateMandalGallery
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteMandalGallery
  );

module.exports = router;
