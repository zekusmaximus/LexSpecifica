const express = require('express');
const router = express.Router();
const generationController = require('../controllers/generation-controller');

router.post('/framework', generationController.generateFramework);
router.post('/policies', generationController.generatePolicies);
router.post('/conflicts', generationController.generateConflicts);

module.exports = router;
