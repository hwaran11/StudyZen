// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Productivity', 'Active Recreation', 'Personal Development']
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: String, // ISO format date string
        required: true
    },
    startTime: {
        type: String, // Time string, e.g., "08:00 AM"
        required: true
    },
    endTime: {
        type: String, // Time string, e.g., "09:00 AM"
        required: true
    },
    priority: {
        type: String,
        required: true,
        enum: ['High', 'Medium', 'Low']
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
