const express = require('express');
const {
  createEvent,
  getEvents,
  getEventsForWeek,
  getEventsForDay,  // Add this line
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createEvent)
  .get(protect, getEvents);

router.route('/week')
  .get(protect, getEventsForWeek);

router.route('/day')  // Add this route
  .get(protect, getEventsForDay);

router.route('/:id')
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

module.exports = router;
