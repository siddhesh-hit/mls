const router = require("express").Router();

const { visitCount } = require("../controllers/visit.controllers");

// routes
router.put("/", visitCount);

module.exports = router;
