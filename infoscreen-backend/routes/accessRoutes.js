const express = require('express');
const accessController = require('../controllers/accessController');
const router = express.Router();


router.get('/managers', accessController.getManagersAndAdmins);
router.get('/roles', accessController.getAllRoles);
router.post('/createrole', accessController.createRole);
router.put('/updaterole', accessController.updateRole);
router.delete('/deleterole/:userId', accessController.deleteRole);

module.exports = router;
