const router = require("express").Router();

const {
  visitCount,
  getAllNotification,
} = require("../../controllers/portals/visit.controllers");

// routes
router.put("/", visitCount);
router.get("/notification", getAllNotification);

module.exports = router;
