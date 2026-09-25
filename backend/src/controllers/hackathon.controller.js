const Hackathon = require('../models/hackathon.model');
const HackathonQuery = require('../models/hackathonQuery.model');
const asyncHandler = require('../middleware/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const AppError = require('../utils/appError');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[0-9]{10}$/;
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const PROBLEM_GROUPS = {
  Agriculture: {
    'Fair Price Discovery for Crops':
      'Farmers in rural areas often sell their agricultural produce to local middlemen or agents without knowing the actual prevailing market (mandi) rate. This information asymmetry leads to significant exploitation and substantially lower earnings for the farmer.',
    'Early Warning for Crop Damage':
      'Sudden pest infestations, fungal or bacterial plant diseases, and erratic micro-weather shifts such as unseasonal frost, hailstorms, and heavy downpours frequently damage standing crops before farmers can detect the threat or take preventive action, resulting in major financial losses.',
    'Simplified Access to Loans and Government Schemes':
      'The central and state governments launch numerous agricultural subsidy schemes, crop insurance policies, and low-interest institutional loan facilities. However, smallholder farmers remain largely unaware of their eligibility, and navigating complex government paperwork or multiple physical offices is overwhelming.',
  },
  'Army / Defence': {
    'Health Monitoring for Soldiers in Remote Areas':
      'Armed forces personnel deployed at remote border outposts, extreme high-altitude glaciers, or rugged dense terrains face severe physiological hazards including hypothermia, hypoxia, dehydration, extreme fatigue, and combat injuries that often go undetected until critical.',
    'Emergency Communication in No-Network Zones':
      'In tactical forward positions, dense jungle warfare, mountainous border frontiers, or disaster-struck zones where commercial cellular towers and internet backbones are non-existent, soldiers are cut off from voice and data networks, creating catastrophic vulnerability during ambushes or medical emergencies.',
    'Community Reporting Near Border Areas':
      'Civilian populations living in sensitive border villages frequently observe suspicious vehicular movement, unidentified drones, unauthorized border infiltration, or suspicious packages long before security patrols arrive. However, they lack a safe, swift, and confidential medium to inform defence authorities.',
  },
  Startups: {
    'Local Skilled Worker Marketplace':
      'Informal blue-collar artisans and skilled tradespeople such as carpenters, electricians, plumbers, masons, mechanics, and tailors rely almost entirely on irregular word-of-mouth recommendations, leading to severe income volatility. At the same time, local households and small businesses struggle to locate reliable, vetted service providers nearby.',
    'Waste-to-Earn Rewards Platform':
      'Civic segregation and recycling initiatives struggle because households, students, and shops have little tangible incentive to separate dry recyclables such as plastic, paper, e-waste, and aluminium from wet municipal garbage, leading to overflowing landfills and wasted circular-economy potential.',
    'Home-Cooked Meal Delivery Network':
      'Millions of college students, young professionals, and migrant workers living away from home depend on unhygienic, expensive, or repetitive commercial fast food. Simultaneously, millions of skilled homemakers possess cooking talent and underutilized kitchen capacity but lack the logistics or marketing platform to monetize their skills.',
  },
  'Real-Life Problems': {
    'Reducing Household Water Wastage':
      'Urban and semi-urban localities suffer from chronic groundwater depletion and water scarcity, yet millions of litres of potable treated water are lost daily in residential buildings due to overhead tank overflows, slow-leaking cisterns, faulty taps, and unattended irrigation hoses.',
    'Daily Check-In System for Elderly Living Alone':
      'An increasing number of senior citizens reside independently while their adult children live in different cities or abroad. In the event of a sudden fall, stroke, cardiac distress, or disorientation, days may pass before anyone notices, often resulting in tragic and preventable outcomes.',
    'Support System for Student Exam Stress':
      'High-stakes competitive examinations, semester finals, and academic performance pressure generate acute anxiety and mental exhaustion among high school and university students. Fear of social stigma, peer competition, and lack of immediate, confidential counselling prevent students from seeking help.',
  },
  'Road & Vehicle Safety': {
    'Automatic Accident Alert System':
      'In vehicular collisions and two-wheeler crashes, particularly along rural highways or during night commutes, critical medical attention during the Golden Hour is frequently delayed because victims are incapacitated and unable to call for help, while passersby may hesitate to intervene.',
    'Helmet and Seatbelt Reminder System':
      'A significant percentage of vehicular fatalities on Indian roads stem directly from failure to buckle seatbelts in cars or wear helmets on motorized two-wheelers. Despite punitive traffic fines, drivers and riders routinely neglect protective gear due to complacency or convenience.',
    'Pothole and Accident Hotspot Reporting':
      'Unrepaired potholes, washed-out road shoulders, and poorly engineered blind intersections cause thousands of severe road accidents annually. Municipal road authorities often remain unaware of road damage until accidents occur, while citizens find manual complaint filing cumbersome and futile.',
  },
};

const PROBLEM_CODES = {
  'Fair Price Discovery for Crops': 'AGRI-01',
  'Early Warning for Crop Damage': 'AGRI-02',
  'Simplified Access to Loans and Government Schemes': 'AGRI-03',
  'Health Monitoring for Soldiers in Remote Areas': 'DEF-01',
  'Emergency Communication in No-Network Zones': 'DEF-02',
  'Community Reporting Near Border Areas': 'DEF-03',
  'Local Skilled Worker Marketplace': 'START-01',
  'Waste-to-Earn Rewards Platform': 'START-02',
  'Home-Cooked Meal Delivery Network': 'START-03',
  'Reducing Household Water Wastage': 'LIFE-01',
  'Daily Check-In System for Elderly Living Alone': 'LIFE-02',
  'Support System for Student Exam Stress': 'LIFE-03',
  'Automatic Accident Alert System': 'ROAD-01',
  'Helmet and Seatbelt Reminder System': 'ROAD-02',
  'Pothole and Accident Hotspot Reporting': 'ROAD-03',
};

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
  const {
    teamName,
    leaderName,
    collegeName,
    course,
    yearOfStudy,
    category,
    problemStatement,
    problemDesc,
    problemCode,
    decl1,
    decl2,
  } = req.body;

  if (!String(teamName || '').trim()) throw new AppError('Please enter your team name.', 400);
  if (!String(leaderName || '').trim()) throw new AppError("Please enter the team leader's name.", 400);
  if (!String(collegeName || '').trim()) throw new AppError('Please enter your college name.', 400);
  if (!String(course || '').trim()) throw new AppError('Please enter your course.', 400);
  if (!YEARS.includes(yearOfStudy)) throw new AppError('Please select a year.', 400);
  if (!PROBLEM_GROUPS[category]) throw new AppError('Please select a category.', 400);
  if (!PROBLEM_GROUPS[category][String(problemStatement || '').trim()]) {
    throw new AppError('Please select a problem statement.', 400);
  }
  if (String(problemDesc || '').trim() !== PROBLEM_GROUPS[category][String(problemStatement).trim()]) {
    throw new AppError('Please select the matching problem description.', 400);
  }
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
    if (!/^[0-9]+$/.test(member.roll)) throw new AppError(`Enter a numeric roll number for member ${i + 1}.`, 400);
  });

  const mobiles = members.map((member) => member.mobile);
  const duplicateInTeam = mobiles.find((mobile, index) => mobiles.indexOf(mobile) !== index);
  if (duplicateInTeam) {
    throw new AppError(`Mobile number ${duplicateInTeam} is used more than once in this team.`, 400);
  }

  const existingMobile = await Hackathon.findOne({
    'members.mobile': { $in: mobiles },
  })
    .select('teamId members.name members.mobile')
    .lean();

  if (existingMobile) {
    const matched = (existingMobile.members || []).find((member) => mobiles.includes(member.mobile));
    throw new AppError(
      `Mobile number ${matched?.mobile || ''} is already registered with team ${existingMobile.teamId}.`,
      400
    );
  }

  const teamId = await uniqueTeamId(teamName);

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
    problemStatement: String(problemStatement).trim(),
    problemCode: PROBLEM_CODES[String(problemStatement).trim()] || String(problemCode || '').trim(),
    problemDesc: String(problemDesc).trim(),
    declarations: {
      infoCorrect: true,
      participateAllRounds: true,
    },
  });

  return apiResponse.success(res, {
    status: 201,
    message: 'Registration submitted',
    data: {
      teamId: registration.teamId,
    },
  });
});

const listRegistrations = asyncHandler(async (_req, res) => {
  const teams = await Hackathon.find()
    .sort({ createdAt: -1 })
    .select(
      'teamId teamName collegeName course yearOfStudy category problemStatement problemCode problemDesc leaderName members.name members.email members.mobile members.roll members.isLeader createdAt'
    )
    .lean();

  return apiResponse.success(res, {
    message: 'Registrations',
    data: teams.map((team) => ({
      teamId: team.teamId,
      teamName: team.teamName,
      collegeName: team.collegeName,
      course: team.course,
      yearOfStudy: team.yearOfStudy,
      category: team.category,
      problemStatement: team.problemStatement,
      problemCode: team.problemCode,
      problemDesc: team.problemDesc,
      leaderName: team.leaderName,
      members: (team.members || []).map((member) => ({
        name: member.name,
        email: member.email,
        mobile: member.mobile,
        roll: member.roll,
        isLeader: Boolean(member.isLeader),
      })),
      registeredAt: team.createdAt,
    })),
  });
});

const createQuery = asyncHandler(async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const message = String(req.body?.message || '').trim();

  if (!name) throw new AppError('Please enter your name.', 400);
  if (!EMAIL_RE.test(email)) throw new AppError('Enter a valid email.', 400);
  if (!message) throw new AppError('Please write your question.', 400);

  await HackathonQuery.create({ name, email, message });

  return apiResponse.success(res, {
    status: 201,
    message: 'Query submitted',
  });
});

module.exports = { createRegistration, listRegistrations, createQuery };
