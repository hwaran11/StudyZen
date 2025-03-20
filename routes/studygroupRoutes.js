const express = require('express');
const router = express.Router();
const StudyGroup = require('../models/StudyGroup');
const User = require('../models/User');
const { addUserToChannel } = require('../discordBot'); // Function to add user to Discord channel

// Fetch all study groups
router.get('/all', async (req, res) => {
    try {
        console.log('Fetching all study groups');
        const groups = await StudyGroup.find().populate('members');
        res.json(groups);
        console.log('Study groups fetched successfully');
    } catch (err) {
        console.error('Error fetching all groups:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Join a study group
router.post('/join', async (req, res) => {
    try {
        const { userId, groupId } = req.body;
        console.log(`User ${userId} attempting to join group ${groupId}`);

        const user = await User.findById(userId);
        const group = await StudyGroup.findById(groupId);

        if (!user) {
            console.error(`User ${userId} not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        if (!group) {
            console.error(`Group ${groupId} not found`);
            return res.status(404).json({ error: 'Group not found' });
        }

        // Add user to the group's member list if not already a member
        if (!group.members.includes(userId)) {
            group.members.push(userId);
            await group.save();
            console.log(`User ${userId} added to group ${groupId} in database`);
        } else {
            console.log(`User ${userId} is already a member of group ${groupId}`);
        }

        // Add user to the Discord channel
        await addUserToChannel(group.discordChannelId, user.discordUserId);
        console.log(`User ${userId} added to Discord channel ${group.discordChannelId}`);

        res.status(200).json({ message: 'User added to group and Discord channel' });
    } catch (err) {
        console.error('Error joining group:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new study group
router.post('/create', async (req, res) => {
    try {
        const { groupName, groupSize, interactionStyle, studySchedule, sessionLength, groupGoals, engagementLevel, leadershipStyle, groupSupport, discordChannelLink } = req.body;
        console.log('Creating study group with data:', req.body);

        const newGroup = new StudyGroup({
            groupName,
            groupSize,
            interactionStyle,
            studySchedule,
            sessionLength,
            groupGoals,
            engagementLevel,
            leadershipStyle,
            groupSupport,
            discordChannelLink
        });

        await newGroup.save();
        res.status(201).json(newGroup);
        console.log('Study group created successfully:', newGroup);
    } catch (err) {
        console.error('Error creating study group:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
