// profileController.js
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Images Only!'));
    }
  },
}).single('profilePic');

exports.updateProfileStep1 = async (req, res) => {
  const { fullName, profilePic, shortBio, discordUsername, discordId } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.partnerSetup.step1 = { fullName, profilePic, shortBio, discordUsername, discordId };
    await user.save();
    res.json(user.partnerSetup.step1);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfileStep2 = async (req, res) => {
  const { university, program, semester, events } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.partnerSetup.step2 = { university, program, semester, events };
    user.university = university;
    user.program = program;
    user.semester = semester;
    user.events = events;
    await user.save();
    res.json(user.partnerSetup.step2);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfileStep3 = async (req, res) => {
  const { bestStudyTimes } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.partnerSetup.step3 = { bestStudyTimes };
    await user.save();
    res.json(user.partnerSetup.step3);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfileStep4 = async (req, res) => {
  const { studyGoals } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.partnerSetup.step4 = { studyGoals };
    await user.save();
    res.json(user.partnerSetup.step4);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfileStep5 = async (req, res) => {
  const { learningCharacteristics } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.partnerSetup.step5 = { learningCharacteristics };
    await user.save();
    res.json(user.partnerSetup.step5);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfileStep6 = async (req, res) => {
  const { weeklyAvailability } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.partnerSetup.step6 = { weeklyAvailability };
    await user.save();
    res.json(user.partnerSetup.step6);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfileStep7 = async (req, res) => {
  const { personalAttributes } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.partnerSetup.step7 = { personalAttributes };
    await user.save();
    res.json(user.partnerSetup.step7);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfileStep8 = async (req, res) => {
  const { supportNeeds } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.partnerSetup.step8 = { supportNeeds };
    await user.save();
    res.json(user.partnerSetup.step8);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfileStep9 = async (req, res) => {
  const { selfAssessment } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.partnerSetup.step9 = { selfAssessment };
    await user.save();
    res.json(user.partnerSetup.step9);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfileStep10 = async (req, res) => {
  const { motivation } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.partnerSetup.step10 = { motivation };
    await user.save();
    res.json(user.partnerSetup.step10);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.submitPartnerSetup = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.partnerSetup.completed = true;
    await user.save();
    res.json({ message: 'Partner setup completed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfileDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User partner setup details:', user.partnerSetup); // Log the user details
    res.json(user.partnerSetup);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('fullName username partnerSetup');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
