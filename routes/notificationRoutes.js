const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/', notificationController.createNotification);
router.get('/:userId', notificationController.getNotifications);
router.post('/read', notificationController.markAsRead);

module.exports = router;
