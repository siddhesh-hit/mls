const express = require("express");
const router = express.Router();

// internal routes
const userRoutes = require("./routes/portals/user.routes");
const sabhaRoutes = require("./routes/portals/sabha.routes");
const parishadRoutes = require("./routes/portals/parishad.routes");
const mandalRoutes = require("./routes/portals/mandal.routes");
const galleryRoutes = require("./routes/portals/gallery.routes");
const graphRoutes = require("./routes/portals/graph.routes");
const libraryRoutes = require("./routes/portals/library.routes");
const faqRoutes = require("./routes/portals/faq.routes");
const rajyapalRoutes = require("./routes/portals/rajyapal.routes");
const memberRoutes = require("./routes/portals/member.routes");
const feedbackRoutes = require("./routes/portals/feedback.routes");
const helpdeskRoutes = require("./routes/portals/helpdesk.routes");
const sessionRoutes = require("./routes/portals/session.routes");

const assemblyRoutes = require("./routes/masters/assembly.routes");
const constituencyRoutes = require("./routes/masters/constituency.routes");
const districtRoutes = require("./routes/masters/district.routes");
const genderRoutes = require("./routes/masters/gender.routes");
const partyRoutes = require("./routes/masters/party.routes");

const visitRoute = require("./routes/portals/visit.routes");

// defining the routes
router.use("/user", userRoutes);
router.use("/sabha", sabhaRoutes);
router.use("/parishad", parishadRoutes);
router.use("/mandal", mandalRoutes);
router.use("/gallery", galleryRoutes);
router.use("/graph", graphRoutes);
router.use("/library", libraryRoutes);
router.use("/faq", faqRoutes);
router.use("/rajyapal", rajyapalRoutes);
router.use("/member", memberRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/helpdesk", helpdeskRoutes);
router.use("/session", sessionRoutes);

router.use("/assembly", assemblyRoutes);
router.use("/constituency", constituencyRoutes);
router.use("/district", districtRoutes);
router.use("/gender", genderRoutes);
router.use("/party", partyRoutes);

router.use("/visit", visitRoute);

module.exports = router;
