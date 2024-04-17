const express = require('express');
const componentController = require('../controllers/componentController');
const router = express.Router();

router.get('/:id/orgcomponents', componentController.getOrgComponents);
router.put('/:id/kaizenboard', componentController.getKaizenBoard);
router.get('/:id/selectedcomponents', componentController.getSelectedComponents);
router.post('/structure', componentController.setComponentStructure);

module.exports = router;
