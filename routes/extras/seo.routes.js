const SeoController = require('../../controllers/extras/seo.controllers');
const router = require('express').Router();
const { authMiddleware, checkRoleMiddleware, hasPermission } = require('../../middlewares/authMiddleware');

router.get('/page', SeoController.getSEOByPage)
router.route('/').post(authMiddleware, checkRoleMiddleware(['SuperAdmin', 'Admin', 'ContentCreator']), hasPermission('create'), SeoController.createSEO).get(SeoController.getAllSEO);

router.route("/:id").get(SeoController.getSEOById).put(authMiddleware, checkRoleMiddleware(['SuperAdmin', 'Admin', 'ContentCreator']), hasPermission('update'), SeoController.updateSEO).delete(authMiddleware, checkRoleMiddleware(['SuperAdmin', 'Admin']), hasPermission('delete'), SeoController.DeleteById);


module.exports = router;