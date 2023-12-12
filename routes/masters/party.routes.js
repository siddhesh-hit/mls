const router = require("express").Router();
const multer = require("multer");

const {
  createParty,
  getAllParty,
  getParty,
  updateParty,
  deleteParty,
} = require("../../controllers/masters/party.controllers");

const {
  authMiddleware,
  checkRoleMiddleware,
} = require("../../middlewares/authMiddleware");

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/party");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-party-${file.originalname}`);
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
  .get(getAllParty)
  .post(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
    upload.fields([
      {
        name: "party_flag",
      },
      {
        name: "party_symbol",
      },
    ]),
    createParty
  );

router
  .route("/:id")
  .get(getParty)
  .put(
    authMiddleware,
    checkRoleMiddleware(["Admin"]),
    upload.fields([
      {
        name: "party_flag",
      },
      {
        name: "party_symbol",
      },
    ]),
    updateParty
  )
  .delete(authMiddleware, checkRoleMiddleware(["Admin"]), deleteParty);

module.exports = router;
