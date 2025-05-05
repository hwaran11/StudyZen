const User = require('../models/User');

// Update Group Setup Step 1
exports.updateGroupStep1 = async (req, res) => {
  const { groupSize } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.groupSetup = user.groupSetup || {};
      user.groupSetup.step1 = { groupSize };

      const updatedUser = await user.save();
      res.json({
        groupSize: updatedUser.groupSetup.step1.groupSize,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Group Setup Step 2
exports.updateGroupStep2 = async (req, res) => {
  const { interactionStyle } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.groupSetup = user.groupSetup || {};
      user.groupSetup.step2 = { interactionStyle };

      const updatedUser = await user.save();
      res.json({
        interactionStyle: updatedUser.groupSetup.step2.interactionStyle,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Group Setup Step 3
exports.updateGroupStep3 = async (req, res) => {
  const { studySchedule } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.groupSetup = user.groupSetup || {};
      user.groupSetup.step3 = { studySchedule };

      const updatedUser = await user.save();
      res.json({
        studySchedule: updatedUser.groupSetup.step3.studySchedule,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Group Setup Step 4
exports.updateGroupStep4 = async (req, res) => {
  const { sessionLength } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.groupSetup = user.groupSetup || {};
      user.groupSetup.step4 = { sessionLength };

      const updatedUser = await user.save();
      res.json({
        sessionLength: updatedUser.groupSetup.step4.sessionLength,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Group Setup Step 5
exports.updateGroupStep5 = async (req, res) => {
  const { groupGoals } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.groupSetup = user.groupSetup || {};
      user.groupSetup.step5 = { groupGoals };

      const updatedUser = await user.save();
      res.json({
        groupGoals: updatedUser.groupSetup.step5.groupGoals,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Group Setup Step 6
exports.updateGroupStep6 = async (req, res) => {
  const { engagementLevel } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.groupSetup = user.groupSetup || {};
      user.groupSetup.step6 = { engagementLevel };

      const updatedUser = await user.save();
      res.json({
        engagementLevel: updatedUser.groupSetup.step6.engagementLevel,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Group Setup Step 7
exports.updateGroupStep7 = async (req, res) => {
  const { leadershipStyle } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.groupSetup = user.groupSetup || {};
      user.groupSetup.step7 = { leadershipStyle };

      const updatedUser = await user.save();
      res.json({
        leadershipStyle: updatedUser.groupSetup.step7.leadershipStyle,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Group Setup Step 8
exports.updateGroupStep8 = async (req, res) => {
  const { groupSupport } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.groupSetup = user.groupSetup || {};
      user.groupSetup.step8 = { groupSupport };

      const updatedUser = await user.save();
      res.json({
        groupSupport: updatedUser.groupSetup.step8.groupSupport,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/// Get Group Setup Details
exports.getGroupSetupDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user.groupSetup);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Finalize Group Setup
exports.submitGroupSetup = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.groupSetup.completed = true;
      await user.save();
      res.json({ message: 'Group setup completed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};