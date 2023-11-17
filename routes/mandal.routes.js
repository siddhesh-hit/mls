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

const upload = multer({ storage: storage });

// routes
router
  .route("/")
  .get(getVidhanMandals)
  .post(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
    upload.fields([
      {
        name: "marathi_about_us_img",
        maxCount: 3,
      },
      {
        name: "marathi_about_us_doc",
        maxCount: 3,
      },
      {
        name: "english_about_us_img",
        maxCount: 3,
      },
      {
        name: "english_about_us_doc",
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
        name: "marathi.about_us",
        maxCount: 1,
      },
      {
        name: "marathi.about_us.*.image",
        maxCount: 1,
      },
    ]),
    updateVidhanMandal
  )
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteVidhanMandal);

module.exports = router;
