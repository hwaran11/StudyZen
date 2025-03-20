const express = require('express');
const router = express.Router();
const mindfulnessController = require('../controllers/mindfulnessController');

router.post('/sessions', mindfulnessController.createSession);
router.get('/analytics/frequency', mindfulnessController.getFrequency);
router.get('/analytics/time-of-day', mindfulnessController.getTimeOfDayAnalysis);

module.exports = router;
