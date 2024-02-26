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
const requestRoutes = require("./routes/portals/request.routes");
const interestRoutes = require("./routes/portals/interest.routes");
const debateRoutes = require("./routes/portals/debate.routes");
const ministerRoutes = require("./routes/portals/minister.routes");

const assemblyRoutes = require("./routes/masters/assembly.routes");
const constituencyRoutes = require("./routes/masters/constituency.routes");
const districtRoutes = require("./routes/masters/district.routes");
const genderRoutes = require("./routes/masters/gender.routes");
const partyRoutes = require("./routes/masters/party.routes");
const navigationRoutes = require("./routes/masters/navigation.routes");
const sessionFieldRoutes = require("./routes/masters/session.routes");
const designationRoutes = require("./routes/masters/designation.routes");

const visitRoute = require("./routes/extras/visit.routes");
const notificationRoute = require("./routes/extras/notification.routes");

const pendingRoutes = require("./routes/reports/pending.routes");
const auditRoutes = require("./routes/reports/audit.routes");
const archiveRoutes = require("./routes/reports/archive.routes");
const resetRoutes = require("./routes/reports/resethead.routes");

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
router.use("/request", requestRoutes);
router.use("/interest", interestRoutes);
router.use("/debate", debateRoutes);
router.use("/minister", ministerRoutes);

router.use("/assembly", assemblyRoutes);
router.use("/constituency", constituencyRoutes);
router.use("/district", districtRoutes);
router.use("/gender", genderRoutes);
router.use("/party", partyRoutes);
router.use("/navigation", navigationRoutes);
router.use("/sessionField", sessionFieldRoutes);
router.use("/designation", designationRoutes);

router.use("/visit", visitRoute);
router.use("/notification", notificationRoute);

router.use("/pending", pendingRoutes);
router.use("/audit", auditRoutes);
router.use("/archive", archiveRoutes);
router.use("/reset", resetRoutes);

module.exports = router;
