const express = require('express');
const componentController = require('../controllers/componentController');
const router = express.Router();

router.get('/componentStructures', componentController.getOrgComponents);
router.put('/kaizen', componentController.getKaizenBoard);
router.get('/:id/selectedcomponents', componentController.getSelectedComponents);
router.post('/createStructure', componentController.createComponentStructure);
router.post('/updateActiveStatus', componentController.updateActiveStatus);
router.get('/availableComponents', componentController.getAvailableSystemComponents);

module.exports = router;
