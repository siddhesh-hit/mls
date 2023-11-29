const router = require("express").Router();
const multer = require("multer");

const {
  getVidhanMandals,
  getVidhanMandalById,
  createVidhanMandal,
  updateVidhanMandal,
  deleteVidhanMandal,
} = require("../controllers/mandal.controllers");

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

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2000000, // 1000000 Bytes = 1 MB
  },
});

// routes
router
  .route("/")
  .get(getVidhanMandals)
  .post(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
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
    checkRoleMiddleware(["Admin"]),
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
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteVidhanMandal);

module.exports = router;
