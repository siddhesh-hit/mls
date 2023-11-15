const router = require("express").Router();
const multer = require("multer");

const {
  createVidhanSabha,
  getVidhanSabha,
  getVidhanSabhaById,
  updateVidhanSabha,
  deleteVidhanSabha,
} = require("../controllers/sabha.controllers");

// multer configuration

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/sabha");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname + "sabha");
  },
});

const upload = multer({ storage: storage });

// routes
router.post("/", upload.single("image"), createVidhanSabha);
router.get("/", getVidhanSabha);
router.get("/:id", getVidhanSabhaById);
router.put("/:id", upload.single("image"), updateVidhanSabha);
router.delete("/:id", deleteVidhanSabha);

module.exports = router;
