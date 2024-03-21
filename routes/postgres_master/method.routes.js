const router = require("express").Router();

const {
  getMethod,
  getMethodType,
  getMethodSubType,
} = require("../../controllers/postgres_master/method.controllers");

// routes

router.get("/method", getMethod);
router.get("/methodtype", getMethodType);
router.get("/methodsubtype", getMethodSubType);

module.exports = router;
