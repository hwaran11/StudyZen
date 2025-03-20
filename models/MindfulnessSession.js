const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MindfulnessSessionSchema = new Schema({
    userId: { type: mongoose.Types.ObjectId, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    timeOfDay: { type: String, required: true } // e.g., "Morning", "Afternoon", "Evening"
});

const MindfulnessSession = mongoose.model('MindfulnessSession', MindfulnessSessionSchema);

module.exports = MindfulnessSession;
