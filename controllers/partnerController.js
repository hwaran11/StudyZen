const User = require('../models/User');
const Notification = require('../models/Notification');
const { ObjectId } = require('mongodb');
const { knn } = require('../knn');

const createUserVector = (user) => {
    const vector = [];
    vector.push(...user.partnerSetup.step4.studyGoals.map(goal => goal.length));
    vector.push(...user.partnerSetup.step3.bestStudyTimes.map(time => time.length));
    vector.push(...user.partnerSetup.step5.learningCharacteristics.map(char => char.length));
    vector.push(...user.partnerSetup.step6.weeklyAvailability.map(day => day.length));
    vector.push(...user.partnerSetup.step7.personalAttributes.map(attr => attr.length));
    vector.push(...user.partnerSetup.step8.supportNeeds.map(need => need.length));
    vector.push(...user.partnerSetup.step9.selfAssessment.map(assess => assess.length));
    vector.push(...user.partnerSetup.step10.motivation.map(mot => mot.length));
    return vector;
};

exports.getMatchedPartners = async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(new ObjectId(userId));

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const potentialPartners = await User.find({
            _id: { $ne: userId },
            'partnerSetup.completed': true
        }).lean();

        const userVector = createUserVector(user);
        const partnerVectors = potentialPartners.map(createUserVector);

        const neighborIndices = knn(userVector, partnerVectors);
        const recommendedPartners = neighborIndices.map(index => potentialPartners[index]);

        res.json(recommendedPartners);
    } catch (err) {
        console.error('Error fetching partners:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAcceptedPartners = async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const notifications = await Notification.find({
            userId,
            type: 'connection_accepted',
            status: 'unread'
        });

        const acceptedUserIds = notifications.map(notification => {
            const userIdMatch = notification.message.match(/user ID (\w+)./);
            return userIdMatch ? userIdMatch[1] : null;
        }).filter(id => id !== null);

        const acceptedUsers = await User.find({
            _id: { $in: acceptedUserIds }
        });

        res.json(acceptedUsers);
    } catch (err) {
        console.error('Error fetching accepted partners:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.connectWithPartner = async (req, res) => {
    try {
        const { userId, partnerId } = req.body;

        // Check if a connection request notification already exists
        const existingNotification = await Notification.findOne({
            userId: partnerId,
            message: new RegExp(userId, 'i'),
            type: 'connection_request',
            status: 'unread'
        });

        if (existingNotification) {
            return res.status(400).json({ message: 'Connection request already sent' });
        }

        const user = await User.findById(userId);
        const notification = new Notification({
            userId: partnerId,
            message: `You have a new connection request from ${user.partnerSetup.step1.fullName}.`,
            type: 'connection_request',
            status: 'unread'
        });

        await notification.save();

        res.status(200).json({ message: 'Connection request sent' });
    } catch (error) {
        console.error('Error connecting with partner:', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
};

exports.respondToConnection = async (req, res) => {
    try {
        const { requestId, response } = req.body;

        if (!ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Invalid request ID' });
        }

        const notification = await Notification.findById(requestId);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        const match = notification.message.match(/user ID (\w+)./);
        if (!match) {
            return res.status(400).json({ message: 'Invalid notification message format' });
        }
        const requesterId = match[1];

        if (response === 'accepted') {
            const userId = notification.userId;

            const user = await User.findById(userId);
            const requester = await User.findById(requesterId);

            if (!user || !requester) {
                return res.status(404).json({ message: 'User not found' });
            }

            notification.status = 'accepted';
            await notification.save();

            user.connectedUsers.push(requesterId);
            requester.connectedUsers.push(userId);
            await user.save();
            await requester.save();

            const newNotification = new Notification({
                userId: requesterId,
                type: 'connection_accepted',
                message: `${user.partnerSetup.step1.fullName} has accepted your connection request. Discord User ID: ${user.partnerSetup.step1.discordId}. Open Discord Profile: https://discordapp.com/users/${user.partnerSetup.step1.discordId}`,
                status: 'unread'
            });
            await newNotification.save();

            res.status(200).json({ user });
        } else {
            notification.status = 'rejected';
            await notification.save();
            res.status(200).json({ message: 'Connection request rejected.' });
        }
    } catch (error) {
        console.error('Error responding to connection request:', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
};

exports.getConnectedUsers = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId).populate('connectedUsers', 'username profilePic online partnerSetup');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.connectedUsers);
    } catch (error) {
        console.error('Error fetching connected users:', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
};
