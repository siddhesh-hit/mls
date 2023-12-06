const router = require("express").Router();
const multer = require("multer");

const {
  getLibraries,
  getLibrary,
  createLibrary,
  updateLibrary,
  deleteLibrary,
} = require("../controllers/library.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../middlewares/authMiddleware");

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/library");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-library-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2000000, // 1000000 Bytes = 1 MB
  },
  // fileFilter: (req, file, cb) => {
  //     if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
  //         return cb(
  //             new Error(
  //                 'only upload images with jpg, jpeg, png format.'
  //             )
  //         );
  //     }
  //     cb(undefined, true);
  // },
});

// routes
router
  .route("/")
  .get(getLibraries)
  .post(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
    upload.fields([
      {
        name: "banner",
        maxCount: 4,
      },
      {
        name: "document",
        maxCount: 10,
      },
    ]),
    createLibrary
  );

router
  .route("/:id")
  .get(getLibrary)
  .put(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
    upload.fields([
      {
        name: "banner",
        maxCount: 4,
      },
      {
        name: "document",
        maxCount: 10,
      },
    ]),
    updateLibrary
  )
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteLibrary);

module.exports = router;
