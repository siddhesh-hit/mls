const router = require("express").Router();
const multer = require("multer");

const {
  getAllMandalGalleries,
  getMandalGalleryById,
  createMandalGallery,
  updateMandalGallery,
  deleteMandalGallery,
} = require("../controllers/gallery.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../middlewares/authMiddleware");

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/mandal");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-mandal-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// routes
router
  .route("/")
  .get(getAllMandalGalleries)
  .post(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
    upload.fields([{ name: "gallery_image", maxCount: 10 }]),
    createMandalGallery
  );

router
  .route("/:id")
  .get(getMandalGalleryById)
  .put(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
    upload.fields([{ name: "gallery_image", maxCount: 10 }]),
    updateMandalGallery
  )
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteMandalGallery);

module.exports = router;
