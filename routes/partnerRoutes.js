const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');

router.get('/partners', partnerController.getMatchedPartners);
router.post('/partners/connect', partnerController.connectWithPartner);
router.post('/partners/respond', partnerController.respondToConnection);
router.get('/partners/accepted', partnerController.getAcceptedPartners);
router.get('/partners/connected/:userId', partnerController.getConnectedUsers);


module.exports = router;
