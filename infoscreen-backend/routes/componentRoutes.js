const express = require('express');
const componentController = require('../controllers/componentController');
const router = express.Router();

router.get('/:id/orgcomponents', componentController.getOrgComponents);
router.post('/:id/kaizenboard', componentController.getKaizenBoard);
router.get('/:id/selected', componentController.getSelectedComponents);

module.exports = router;
