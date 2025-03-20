const mongoose = require('mongoose');

const StudyGroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  groupSize: { type: String, required: true },
  studySchedule: { type: String, required: true },
  interactionStyle: { type: String, required: true },
  sessionLength: { type: String, required: true },
  groupGoals: { type: String, required: true },
  engagementLevel: { type: String, required: true },
  leadershipStyle: { type: String, required: true },
  groupSupport: { type: String, required: true },
  discordChannelId: { type: String, required: false } // Add this field
});

// Ensure the model uses the correct collection name
module.exports = mongoose.model('StudyGroup', StudyGroupSchema, 'study_groups');
