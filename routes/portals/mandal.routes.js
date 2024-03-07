const router = require("express").Router();
const multer = require("multer");

const {
  getVidhanMandals,
  getActiveVidhanMandal,
  getVidhanMandalById,
  createVidhanMandal,
  updateVidhanMandal,
  deleteVidhanMandal,
} = require("../../controllers/portals/mandal.controllers");

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
router.get(
  "/active",

  getActiveVidhanMandal
);

router
  .route("/")
  .get(getVidhanMandals)
  .post(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("create"),
    upload.fields([
      {
        name: "about_us_img",
        maxCount: 3,
      },
      {
        name: "about_us_doc",
        maxCount: 3,
      },
    ]),
    createVidhanMandal
  );

router
  .route("/:id")
  .get(getVidhanMandalById)
  .put(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin", "ContentCreator"]),
    hasPermission("update"),
    upload.fields([
      {
        name: "about_us_img",
        maxCount: 3,
      },
      {
        name: "about_us_doc",
        maxCount: 3,
      },
    ]),
    updateVidhanMandal
  )
  .delete(
    authMiddleware,
    checkRoleMiddleware(["SuperAdmin", "Admin"]),
    hasPermission("delete"),
    deleteVidhanMandal
  );

module.exports = router;
