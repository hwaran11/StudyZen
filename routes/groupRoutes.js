const express = require('express');
const router = express.Router();
const {
  updateGroupStep1,
  updateGroupStep2,
  updateGroupStep3,
  updateGroupStep4,
  updateGroupStep5,
  updateGroupStep6,
  updateGroupStep7,
  updateGroupStep8,
  getGroupSetupDetails,
  submitGroupSetup
} = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

router.put('/step1', protect, updateGroupStep1);
router.put('/step2', protect, updateGroupStep2);
router.put('/step3', protect, updateGroupStep3);
router.put('/step4', protect, updateGroupStep4);
router.put('/step5', protect, updateGroupStep5);
router.put('/step6', protect, updateGroupStep6);
router.put('/step7', protect, updateGroupStep7);
router.put('/step8', protect, updateGroupStep8);
router.get('/details', protect, getGroupSetupDetails);
router.post('/submit', protect, submitGroupSetup);

module.exports = router;
