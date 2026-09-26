const path = require('path');
const { google } = require('googleapis');
const env = require('../config/env');

// Must match Hackathon.jsx: Math.min(5, Math.max(3, next))
// members[0] = Team Leader, members[1..] = other members
const MIN_TEAM_MEMBERS = 3;
const MAX_TEAM_MEMBERS = 5;
const MAX_NON_LEADER_MEMBERS = MAX_TEAM_MEMBERS - 1; // 4 sheet slots: Member 1..Member 4

const SHEET_HEADERS = [
  'Team ID',
  'Team Name',
  'College',
  'Course',
  'Year',
  'Category',
  'Problem Statement',
  'Problem Code',
  'Problem Description',
  'Leader Name',
  'Leader Email',
  'Leader Contact',
  'Leader Roll No',
  ...Array.from({ length: MAX_NON_LEADER_MEMBERS }, (_, i) => [
    `Member ${i + 1} Name`,
    `Member ${i + 1} Email`,
    `Member ${i + 1} Contact`,
    `Member ${i + 1} Roll No`,
  ]).flat(),
  'Registered At',
];

let sheetsClientPromise = null;
let headersReady = false;

function getCredentialsPath() {
  if (path.isAbsolute(env.googleServiceAccountPath)) {
    return env.googleServiceAccountPath;
  }
  // Resolve from backend root (where server.js runs)
  return path.join(process.cwd(), env.googleServiceAccountPath);
}

async function getSheetsClient() {
  if (!sheetsClientPromise) {
    sheetsClientPromise = (async () => {
      const auth = new google.auth.GoogleAuth({
        keyFile: getCredentialsPath(),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      return google.sheets({ version: 'v4', auth });
    })();
  }
  return sheetsClientPromise;
}

function formatRegisteredAt(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function buildRegistrationRow(registration) {
  const members = Array.isArray(registration.members) ? [...registration.members] : [];
  // Same rule as createRegistration / Hackathon.jsx: index 0 is the team leader
  const leader = members[0] || {};
  const others = members.slice(1);

  const memberValues = [];
  for (let i = 0; i < MAX_NON_LEADER_MEMBERS; i += 1) {
    const member = others[i] || {};
    memberValues.push(
      member.name || '',
      member.email || '',
      member.mobile || '',
      member.roll || ''
    );
  }

  return [
    registration.teamId || '',
    registration.teamName || '',
    registration.collegeName || '',
    registration.course || '',
    registration.yearOfStudy || '',
    registration.category || '',
    registration.problemStatement || '',
    registration.problemCode || '',
    registration.problemDesc || '',
    leader.name || registration.leaderName || '',
    leader.email || '',
    leader.mobile || '',
    leader.roll || '',
    ...memberValues,
    formatRegisteredAt(registration.createdAt || registration.registeredAt),
  ];
}

async function ensureSheetHeaders(sheets) {
  if (headersReady) return;

  const headerRange = `${env.googleSheetTab}!A1:AD1`;
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: env.googleSheetId,
    range: headerRange,
  });

  const firstCell = existing.data.values?.[0]?.[0];
  if (firstCell) {
    headersReady = true;
    return;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: env.googleSheetId,
    range: headerRange,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [SHEET_HEADERS],
    },
  });

  headersReady = true;
}

async function appendHackathonRegistration(registration) {
  if (!env.googleSheetId) {
    console.warn('[googleSheets] GOOGLE_SHEET_ID is not set — skipping sheet sync.');
    return { skipped: true };
  }

  const sheets = await getSheetsClient();
  await ensureSheetHeaders(sheets);

  // A..AD = 30 cols: team(9) + leader(4) + non-leaders(4*4) + registeredAt(1)
  const range = `${env.googleSheetTab}!A:AD`;
  const row = buildRegistrationRow(registration);

  await sheets.spreadsheets.values.append({
    spreadsheetId: env.googleSheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [row],
    },
  });

  return { skipped: false };
}

module.exports = {
  appendHackathonRegistration,
  buildRegistrationRow,
  SHEET_HEADERS,
  MIN_TEAM_MEMBERS,
  MAX_TEAM_MEMBERS,
};
