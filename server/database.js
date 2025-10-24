const fs = require('fs').promises;
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

// CSV file paths
const DATA_DIR = path.join(__dirname, 'data');
const TEAMS_FILE = path.join(DATA_DIR, 'teams.csv');
const COURSES_FILE = path.join(DATA_DIR, 'courses.csv');
const SCORES_FILE = path.join(DATA_DIR, 'scores.csv');
const HANDICAPS_FILE = path.join(DATA_DIR, 'handicaps.csv');

// File locking mechanism to prevent concurrent write issues
let writeLock = Promise.resolve();

// Helper function to read CSV file
async function readCSV(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    if (!content.trim()) {
      return [];
    }
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      cast: (value, context) => {
        // Auto-convert numeric strings to numbers
        if (context.column === 'id' || context.column === 'teamId' ||
            context.column === 'week' || context.column === 'par' ||
            context.column === 'slope' || context.column === 'player1Score' ||
            context.column === 'player2Score' || context.column === 'teamTotal') {
          return value === '' ? value : Number(value);
        }
        if (context.column === 'rating' || context.column === 'handicapIndex') {
          return value === '' ? value : parseFloat(value);
        }
        return value;
      }
    });
    return records;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

// Helper function to write CSV file with file locking
async function writeCSV(filePath, data, columns) {
  // Wait for any previous writes to complete (file locking)
  await writeLock;

  // Create a new promise for this write operation
  writeLock = (async () => {
    const content = stringify(data, { header: true, columns });
    await fs.writeFile(filePath, content, 'utf-8');
  })();

  return writeLock;
}

// Initialize - ensure data directory exists
async function initializeDatabase() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('CSV database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  }
}

// ========== TEAMS OPERATIONS ==========

async function getAllTeams() {
  return await readCSV(TEAMS_FILE);
}

async function getTeamById(id) {
  const teams = await readCSV(TEAMS_FILE);
  return teams.find(t => t.id === Number(id));
}

async function createTeam(teamData) {
  const teams = await readCSV(TEAMS_FILE);
  const newId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;
  const newTeam = {
    id: newId,
    name: teamData.name || '',
    player1: teamData.player1,
    player2: teamData.player2,
    paymentStatus: teamData.paymentStatus || 'Not Paid'
  };
  teams.push(newTeam);
  await writeCSV(TEAMS_FILE, teams, ['id', 'name', 'player1', 'player2', 'paymentStatus']);
  return newId;
}

async function updateTeam(id, teamData) {
  const teams = await readCSV(TEAMS_FILE);
  const index = teams.findIndex(t => t.id === Number(id));
  if (index === -1) {
    throw new Error('Team not found');
  }
  teams[index] = {
    id: Number(id),
    name: teamData.name || '',
    player1: teamData.player1,
    player2: teamData.player2,
    paymentStatus: teamData.paymentStatus || 'Not Paid'
  };
  await writeCSV(TEAMS_FILE, teams, ['id', 'name', 'player1', 'player2', 'paymentStatus']);
}

async function deleteTeam(id) {
  const teams = await readCSV(TEAMS_FILE);
  const filtered = teams.filter(t => t.id !== Number(id));
  await writeCSV(TEAMS_FILE, filtered, ['id', 'name', 'player1', 'player2', 'paymentStatus']);
}

// ========== COURSES OPERATIONS ==========

async function getAllCourses() {
  return await readCSV(COURSES_FILE);
}

// ========== SCORES OPERATIONS ==========

async function getAllScores() {
  const scores = await readCSV(SCORES_FILE);
  return scores.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function createScore(scoreData) {
  const scores = await readCSV(SCORES_FILE);
  const newId = scores.length > 0 ? Math.max(...scores.map(s => s.id)) + 1 : 1;
  const newScore = {
    id: newId,
    teamId: scoreData.teamId,
    courseName: scoreData.courseName,
    week: scoreData.week,
    date: scoreData.date,
    player1Score: scoreData.player1Score,
    player2Score: scoreData.player2Score,
    teamTotal: scoreData.teamTotal
  };
  scores.push(newScore);
  await writeCSV(SCORES_FILE, scores, ['id', 'teamId', 'courseName', 'week', 'date', 'player1Score', 'player2Score', 'teamTotal']);
  return newId;
}

// ========== HANDICAPS OPERATIONS ==========

async function getAllHandicaps() {
  const handicaps = await readCSV(HANDICAPS_FILE);
  return handicaps.sort((a, b) => a.playerName.localeCompare(b.playerName));
}

async function createOrUpdateHandicap(handicapData) {
  const handicaps = await readCSV(HANDICAPS_FILE);
  const index = handicaps.findIndex(h => h.playerName === handicapData.playerName);

  if (index >= 0) {
    handicaps[index].handicapIndex = handicapData.handicapIndex;
  } else {
    handicaps.push({
      playerName: handicapData.playerName,
      handicapIndex: handicapData.handicapIndex
    });
  }

  await writeCSV(HANDICAPS_FILE, handicaps, ['playerName', 'handicapIndex']);
}

module.exports = {
  initializeDatabase,
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getAllCourses,
  getAllScores,
  createScore,
  getAllHandicaps,
  createOrUpdateHandicap
};
