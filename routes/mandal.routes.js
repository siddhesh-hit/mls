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
    cb(null, `${Date.now()}-${file.originalname}-mandal`);
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
        name: "marathi.about_us",
        maxCount: 1,
      },
      {
        name: "marathi.about_us.*.image",
        maxCount: 1,
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
