const router = require("express").Router();

const { visitCount } = require("../../controllers/extras/visit.controllers");

// routes
router.put("/", visitCount);

module.exports = router;
