const express = require('express');
const router = express.Router();
const {
  updateProfileStep1,
  updateProfileStep2,
  updateProfileStep3,
  updateProfileStep4,
  updateProfileStep5,
  updateProfileStep6,
  updateProfileStep7,
  updateProfileStep8,
  updateProfileStep9,
  updateProfileStep10,
  submitPartnerSetup,
  getProfileDetails,
  getUserDetails,
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// Profile update and partner setup steps
router.put('/step1', protect, updateProfileStep1);
router.put('/step2', protect, updateProfileStep2);
router.put('/step3', protect, updateProfileStep3);
router.put('/step4', protect, updateProfileStep4);
router.put('/step5', protect, updateProfileStep5);
router.put('/step6', protect, updateProfileStep6);
router.put('/step7', protect, updateProfileStep7);
router.put('/step8', protect, updateProfileStep8);
router.put('/step9', protect, updateProfileStep9);
router.put('/step10', protect, updateProfileStep10);
router.post('/submit', protect, submitPartnerSetup);
router.get('/details', protect, getProfileDetails);
router.get('/userdetails', protect, getUserDetails);

module.exports = router;
