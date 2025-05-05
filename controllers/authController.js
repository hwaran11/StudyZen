const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const isValidEmail = (email) => {
  return email.endsWith('@utp.edu.my');
};

exports.registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Email domain must be @utp.edu.my' });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

exports.authUser = async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(401).json({ message: 'Email domain must be @utp.edu.my' });
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const partnerSetup = user.partnerSetup;
    const groupSetup = user.groupSetup;

    const isPartnerSetupComplete = partnerSetup.step1.fullName && partnerSetup.step1.profilePic && partnerSetup.step1.shortBio &&
      partnerSetup.step2.university && partnerSetup.step2.program && partnerSetup.step2.semester && partnerSetup.step2.events.length > 0 &&
      partnerSetup.step3.bestStudyTimes.length > 0 && partnerSetup.step4.studyGoals.length > 0 &&
      partnerSetup.step5.learningCharacteristics.length > 0 && partnerSetup.step6.weeklyAvailability.length > 0 &&
      partnerSetup.step7.personalAttributes.length > 0 && partnerSetup.step8.supportNeeds.length > 0 &&
      partnerSetup.step9.selfAssessment.length > 0 && partnerSetup.step10.motivation.length > 0;

    const isGroupSetupComplete = groupSetup.step1.groupSize &&
      groupSetup.step2.interactionStyle.length > 0 && groupSetup.step3.studySchedule.length > 0 &&
      groupSetup.step4.sessionLength.length > 0 && groupSetup.step5.groupGoals.length > 0 &&
      groupSetup.step6.engagementLevel.length > 0 && groupSetup.step7.leadershipStyle.length > 0 &&
      groupSetup.step8.groupSupport.length > 0;

    const isProfileComplete = isPartnerSetupComplete && isGroupSetupComplete;

    res.json({
      _id: user._id,  // Ensure user ID is included in the response
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      isProfileComplete: isProfileComplete,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};


const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

        await user.save();

        const resetUrl = `http://${req.headers.host}/resetyourpassword.html?token=${resetToken}`;

        const message = `
            You are receiving this email because you (or someone else) has requested the reset of a password. 
            Please click the link below to reset your password:
            \n\n ${resetUrl}
        `;

        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message,
        });

        res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return res.status(500).json({ message: 'Email could not be sent' });
    }
};

exports.resetPassword = async (req, res) => {
    console.log('Received reset password request');
    console.log('Request body:', req.body);
    console.log('Request query:', req.query);

    const resetPasswordToken = crypto.createHash('sha256').update(req.query.token).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            console.log('Invalid token');
            return res.status(400).json({ message: 'Invalid token' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};