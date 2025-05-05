// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Get all tasks for a specific date
router.get('/:date', taskController.getTasksByDate);

router.get('/', taskController.getTasksByDate); 

// Create a new task
router.post('/', taskController.createTask);

// Update a task
router.put('/:id', taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

// Toggle task completion
router.patch('/:id/toggle', taskController.toggleTaskCompletion);

router.get('/analytics/priority/:category', taskController.getTasksByPriority);

// Get task completion over time
router.get('/analytics/completion-over-time', taskController.getTaskCompletionOverTime);

module.exports = router;