const express = require("express");
const router = express.Router();

// internal routes
const userRoutes = require("./routes/user.routes");
const sabhaRoutes = require("./routes/sabha.routes");
const parishadRoutes = require("./routes/parishad.routes");
const mandalRoutes = require("./routes/mandal.routes");
const galleryRoutes = require("./routes/gallery.routes");
const graphRoutes = require("./routes/graph.routes");
const libraryRoutes = require("./routes/library.routes");
const faqRoutes = require("./routes/faq.routes");
const rajyapalRoutes = require("./routes/rajyapal.routes");
const memberRoutes = require("./routes/member.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const helpdeskRoutes = require("./routes/helpdesk.routes");
const sessionRoutes = require("./routes/session.routes");

const assemblyRoutes = require("./routes/masters/assembly.routes");
const constituencyRoutes = require("./routes/masters/constituency.routes");
const districtRoutes = require("./routes/masters/district.routes");
const genderRoutes = require("./routes/masters/gender.routes");
const partyRoutes = require("./routes/masters/party.routes");

const visitRoute = require("./routes/visit.routes");

// defining the routes
router.use("/api/user", userRoutes);
router.use("/api/sabha", sabhaRoutes);
router.use("/api/parishad", parishadRoutes);
router.use("/api/mandal", mandalRoutes);
router.use("/api/gallery", galleryRoutes);
router.use("/api/graph", graphRoutes);
router.use("/api/library", libraryRoutes);
router.use("/api/faq", faqRoutes);
router.use("/api/rajyapal", rajyapalRoutes);
router.use("/api/member", memberRoutes);
router.use("/api/feedback", feedbackRoutes);
router.use("/api/helpdesk", helpdeskRoutes);
router.use("/api/session", sessionRoutes);

router.use("/api/assembly", assemblyRoutes);
router.use("/api/constituency", constituencyRoutes);
router.use("/api/district", districtRoutes);
router.use("/api/gender", genderRoutes);
router.use("/api/party", partyRoutes);

router.use("/api/visit", visitRoute);

module.exports = router;
