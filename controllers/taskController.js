// controllers/taskController.js
const Task = require('../models/Task');

exports.getTasksByDate = async (req, res) => {
    try {
        const { date } = req.query;
        console.log('Fetching tasks for date:', date);
        const tasks = await Task.find({ date });
        console.log('Tasks fetched:', tasks);
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.createTask = async (req, res) => {
    const { userId, category, title, date, startTime, endTime, priority } = req.body;
    const task = new Task({
        userId,
        category,
        title,
        date,
        startTime,
        endTime,
        priority,
        completed: false
    });

    try {
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.toggleTaskCompletion = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        task.completed = !task.completed;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getTasksByPriority = async (req, res) => {
    try {
        const { category } = req.params;
        if (!['Productivity', 'Active-Recreation', 'Personal-Development'].includes(category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const priorityDistribution = await Task.aggregate([
            { $match: { category: category.replace('-', ' ') } },
            { $group: { _id: "$priority", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        console.log(`Priority distribution for ${category}:`, priorityDistribution);

        const priorities = ['Low', 'Medium', 'High'];
        const result = priorities.map(priority => {
            const found = priorityDistribution.find(item => item._id === priority);
            return found || { _id: priority, count: 0 };
        });

        res.json(result);
    } catch (error) {
        console.error(`Error fetching ${category} tasks by priority:`, error);
        res.status(500).json({ message: 'Error fetching task distribution', error: error.message });
    }
};

exports.getTaskCompletionOverTime = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        const taskCompletion = await Task.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate },
                    completed: true
                }
            },
            {
                $group: {
                    _id: "$date",
                    taskCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(taskCompletion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
