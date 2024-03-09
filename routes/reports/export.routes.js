const router = require('express').Router()

const { getAllExport, getExportById } = require("../../controllers/reports/export.controllers")
const { authMiddleware, checkRoleMiddleware, hasPermission } = require("../../middlewares/authMiddleware")

// routes
router.route("/").get(authMiddleware, checkRoleMiddleware(["Admin", "SuperAdmin", "Reviewer", "ContentCreator", "User"]), hasPermission("export"), getAllExport)
router.route("/:id").get(authMiddleware, checkRoleMiddleware(["Admin", "SuperAdmin", "Reviewer", "ContentCreator", "User"]), hasPermission("export"), getExportById)

module.exports = router
