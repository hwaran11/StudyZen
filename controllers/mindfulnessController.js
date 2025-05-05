const MindfulnessSession = require('../models/MindfulnessSession');
const mongoose = require('mongoose');
exports.createSession = async (req, res) => {
    try {
        const session = new MindfulnessSession(req.body);
        await session.save();
        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getFrequency = async (req, res) => {
    try {
        const { userId } = req.query;
        const sessions = await MindfulnessSession.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTimeOfDayAnalysis = async (req, res) => {
    try {
        const { userId } = req.query;
        const sessions = await MindfulnessSession.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: "$timeOfDay",
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};