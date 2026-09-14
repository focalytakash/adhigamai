const path = require('path');
const Hackathon = require('../models/hackathon.model');
const asyncHandler = require('../middleware/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const AppError = require('../utils/appError');
const env = require('../config/env');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[0-9]{10}$/;
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const CATEGORIES = [
  'Healthcare',
  'Education',
  'Fintech',
  'Sustainability & Climate',
  'Agriculture',
  'Open Innovation',
];

function generateTeamId(teamName) {
  const prefix = String(teamName || 'XXX')
    .substring(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, 'X')
    .padEnd(3, 'X');
  return `ADHIGAM-${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

async function uniqueTeamId(teamName) {
  for (let i = 0; i < 8; i += 1) {
    const teamId = generateTeamId(teamName);
    const exists = await Hackathon.exists({ teamId });
    if (!exists) return teamId;
  }
  throw new AppError('Could not generate a unique team ID. Please try again.', 500);
}

function parseMembers(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      throw new AppError('Invalid members data.', 400);
    }
  }
  throw new AppError('Members are required.', 400);
}

function isTrue(value) {
  return value === true || value === 'true' || value === '1' || value === 'on';
}

const createRegistration = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Please upload your PPT.', 400);
  }

  const {
    teamName,
    leaderName,
    collegeName,
    course,
    yearOfStudy,
    category,
    projectTitle,
    problemDesc,
    solution,
    techUsed,
    decl1,
    decl2,
  } = req.body;

  if (!String(teamName || '').trim()) throw new AppError('Please enter your team name.', 400);
  if (!String(leaderName || '').trim()) throw new AppError("Please enter the team leader's name.", 400);
  if (!String(collegeName || '').trim()) throw new AppError('Please enter your college name.', 400);
  if (!String(course || '').trim()) throw new AppError('Please enter your course.', 400);
  if (!YEARS.includes(yearOfStudy)) throw new AppError('Please select a year.', 400);
  if (!CATEGORIES.includes(category)) throw new AppError('Please select a category.', 400);
  if (!String(projectTitle || '').trim()) throw new AppError('Please enter a project title.', 400);
  if (!String(problemDesc || '').trim()) throw new AppError('Please describe the problem.', 400);
  if (!String(solution || '').trim()) throw new AppError('Please describe your solution.', 400);
  if (!String(techUsed || '').trim()) throw new AppError('Please list the technologies you are using.', 400);
  if (!isTrue(decl1) || !isTrue(decl2)) {
    throw new AppError('Please accept both declarations.', 400);
  }

  const members = parseMembers(req.body.members).map((member, index) => ({
    name: String(member?.name || '').trim(),
    mobile: String(member?.mobile || '').trim(),
    email: String(member?.email || '').trim().toLowerCase(),
    roll: String(member?.roll || '').trim(),
    isLeader: index === 0,
  }));

  if (members.length < 3 || members.length > 5) {
    throw new AppError('Team must have 3 to 5 members.', 400);
  }

  members.forEach((member, i) => {
    if (!member.name) throw new AppError(`Please enter full name for member ${i + 1}.`, 400);
    if (!MOBILE_RE.test(member.mobile)) throw new AppError(`Enter a valid mobile number for member ${i + 1}.`, 400);
    if (!EMAIL_RE.test(member.email)) throw new AppError(`Enter a valid email for member ${i + 1}.`, 400);
    if (!member.roll) throw new AppError(`Please enter roll number for member ${i + 1}.`, 400);
  });

  const teamId = await uniqueTeamId(teamName);
  const pptKey = path.posix.join('hackathon', req.file.filename);

  const registration = await Hackathon.create({
    teamId,
    teamName: String(teamName).trim(),
    leaderName: String(leaderName).trim(),
    collegeName: String(collegeName).trim(),
    course: String(course).trim(),
    yearOfStudy,
    memberCount: members.length,
    members,
    category,
    projectTitle: String(projectTitle).trim(),
    problemDesc: String(problemDesc).trim(),
    solution: String(solution).trim(),
    techUsed: String(techUsed).trim(),
    ppt: {
      key: pptKey,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    },
    declarations: {
      infoCorrect: true,
      participateAllRounds: true,
    },
  });

  const bucketBase = (env.bucketUrl || `${req.protocol}://${req.get('host')}/uploads`).replace(/\/$/, '');

  return apiResponse.success(res, {
    status: 201,
    message: 'Registration submitted',
    data: {
      teamId: registration.teamId,
      pptKey,
      pptUrl: `${bucketBase}/${pptKey}`,
    },
  });
});

module.exports = { createRegistration };
