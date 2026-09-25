const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    roll: { type: String, required: true, trim: true },
    isLeader: { type: Boolean, default: false },
  },
  { _id: false }
);

const hackathonSchema = new mongoose.Schema(
  {
    teamId: { type: String, required: true, unique: true, index: true },
    teamName: { type: String, required: true, trim: true },
    leaderName: { type: String, required: true, trim: true },
    collegeName: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    yearOfStudy: { type: String, required: true, trim: true },
    memberCount: { type: Number, required: true, min: 3, max: 5 },
    members: {
      type: [memberSchema],
      required: true,
      validate: [(v) => v.length >= 3 && v.length <= 5, 'Team must have 3 to 5 members'],
    },
    category: { type: String, required: true, trim: true },
    problemStatement: { type: String, required: true, trim: true },
    problemCode: { type: String, trim: true, default: '' },
    problemDesc: { type: String, required: true, trim: true },
    declarations: {
      infoCorrect: { type: Boolean, required: true },
      participateAllRounds: { type: Boolean, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hackathon', hackathonSchema);
