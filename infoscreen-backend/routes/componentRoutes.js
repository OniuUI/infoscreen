const express = require('express');
const componentController = require('../controllers/componentController');
const router = express.Router();

router.get('/componentStructures', componentController.getOrgComponents);
router.put('/kaizen', componentController.getKaizenBoard);
router.get('/:id/selectedcomponents', componentController.getSelectedComponents);
router.post('/structure', componentController.setComponentStructure);
router.get('/availableComponents', componentController.getAvailableSystemComponents);

module.exports = router;
