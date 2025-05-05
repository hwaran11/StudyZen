const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  profilePic: { type: String },
  shortBio: { type: String },
  partnerSetup: {
    step1: { fullName: { type: String }, profilePic: { type: String }, shortBio: { type: String }, discordUsername: { type: String },discordId: { type: String },},
    step2: { university: { type: String }, program: { type: String }, semester: { type: String }, events: [{title: { type: String },start: { type: Date },end: { type: Date },hasTutorial: { type: Boolean },}],},
    step3: { bestStudyTimes: [{ type: String }] },
    step4: { studyGoals: [{ type: String }] },
    step5: { learningCharacteristics: [{ type: String }] },
    step6: { weeklyAvailability: [{ type: String }] },
    step7: { personalAttributes: [{ type: String }] },
    step8: { supportNeeds: [{ type: String }] },
    step9: { selfAssessment: [{ type: String }] },
    step10: { motivation: [{ type: String }] },
    completed: { type: Boolean, default: false },
  },
  connectedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  groupSetup: {
    step1: { groupSize: { type: String } },
    step2: { interactionStyle: [{ type: String }] },
    step3: { studySchedule: [{ type: String }] },
    step4: { sessionLength: [{ type: String }] },
    step5: { groupGoals: [{ type: String }] },
    step6: { engagementLevel: [{ type: String }] },
    step7: { leadershipStyle: [{ type: String }] },
    step8: { groupSupport: [{ type: String }] },
    completed: { type: Boolean, default: false },
  },
}, {
  timestamps: true,
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
