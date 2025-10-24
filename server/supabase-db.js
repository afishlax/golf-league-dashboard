const { Pool } = require('pg');
const net = require('net');

// Custom lookup function that forces IPv4 resolution
function lookup(hostname, options, callback) {
  // Force IPv4 by setting family to 4
  const dns = require('dns');
  dns.lookup(hostname, { family: 4 }, (err, address, family) => {
    if (err) {
      console.error('DNS lookup failed:', err);
      return callback(err);
    }
    console.log(`Resolved ${hostname} to IPv4: ${address}`);
    callback(null, address, family);
  });
}

// Override net.connect to use custom lookup
const originalConnect = net.connect;
net.connect = function(...args) {
  const options = args[0];
  if (typeof options === 'object' && !options.lookup) {
    options.lookup = lookup;
  }
  return originalConnect.apply(this, args);
};

// Create connection pool
// Using correct connection pooler hostname with forced IPv4 resolution
const pool = new Pool({
  host: 'aws-1-us-east-2.pooler.supabase.com',  // Correct region from Supabase
  port: 5432,
  database: 'postgres',
  user: 'postgres.dxddqhodsngiilgsxbpr',
  password: 'MC@dba.2025',
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to Supabase PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Initialize - test connection
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('Supabase database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  }
}

// ========== TEAMS OPERATIONS ==========

async function getAllTeams() {
  const result = await pool.query('SELECT * FROM teams ORDER BY id');
  return result.rows;
}

async function getTeamById(id) {
  const result = await pool.query('SELECT * FROM teams WHERE id = $1', [id]);
  return result.rows[0];
}

async function createTeam(teamData) {
  const result = await pool.query(
    'INSERT INTO teams (name, player1, player2, player1_payment, player2_payment) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [
      teamData.name || '',
      teamData.player1,
      teamData.player2,
      teamData.player1Payment || 'Not Paid',
      teamData.player2Payment || 'Not Paid'
    ]
  );
  return result.rows[0].id;
}

async function updateTeam(id, teamData) {
  await pool.query(
    'UPDATE teams SET name = $1, player1 = $2, player2 = $3, player1_payment = $4, player2_payment = $5 WHERE id = $6',
    [
      teamData.name || '',
      teamData.player1,
      teamData.player2,
      teamData.player1Payment || 'Not Paid',
      teamData.player2Payment || 'Not Paid',
      id
    ]
  );
}

async function deleteTeam(id) {
  await pool.query('DELETE FROM teams WHERE id = $1', [id]);
}

// ========== COURSES OPERATIONS ==========

async function getAllCourses() {
  const result = await pool.query('SELECT * FROM courses ORDER BY name');
  return result.rows;
}

async function updateCourse(name, courseData) {
  await pool.query(
    'UPDATE courses SET name = $1, par = $2, slope = $3, rating = $4 WHERE name = $5',
    [courseData.name, courseData.par, courseData.slope, courseData.rating, name]
  );
}

// ========== SCORES OPERATIONS ==========

async function getAllScores() {
  const result = await pool.query(
    'SELECT id, team_id as "teamId", course_name as "courseName", week, date, nine, team_score as "teamScore" FROM scores ORDER BY date DESC, week DESC'
  );
  return result.rows;
}

async function createScore(scoreData) {
  const result = await pool.query(
    'INSERT INTO scores (team_id, course_name, week, date, nine, team_score) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [
      scoreData.teamId,
      scoreData.courseName,
      scoreData.week,
      scoreData.date,
      scoreData.nine || '',
      scoreData.teamScore
    ]
  );
  return result.rows[0].id;
}

async function updateScore(id, scoreData) {
  await pool.query(
    'UPDATE scores SET team_id = $1, course_name = $2, week = $3, date = $4, nine = $5, team_score = $6 WHERE id = $7',
    [
      scoreData.teamId,
      scoreData.courseName,
      scoreData.week,
      scoreData.date,
      scoreData.nine || '',
      scoreData.teamScore,
      id
    ]
  );
}

async function deleteScore(id) {
  await pool.query('DELETE FROM scores WHERE id = $1', [id]);
}

// ========== HANDICAPS OPERATIONS ==========

async function getAllHandicaps() {
  const result = await pool.query(
    'SELECT team_id as "teamId", team_name as "teamName", handicap_index as "handicapIndex" FROM handicaps ORDER BY team_id'
  );
  return result.rows;
}

async function createOrUpdateHandicap(handicapData) {
  await pool.query(
    `INSERT INTO handicaps (team_id, team_name, handicap_index)
     VALUES ($1, $2, $3)
     ON CONFLICT (team_id)
     DO UPDATE SET team_name = $2, handicap_index = $3, updated_at = NOW()`,
    [handicapData.teamId, handicapData.teamName, handicapData.handicapIndex]
  );
}

// ========== SCHEDULE OPERATIONS ==========

async function getAllSchedule() {
  const result = await pool.query(
    'SELECT week, date, course_name as "courseName", nine FROM schedule ORDER BY week'
  );
  return result.rows;
}

async function updateScheduleWeek(week, scheduleData) {
  await pool.query(
    'UPDATE schedule SET date = $1, course_name = $2, nine = $3 WHERE week = $4',
    [scheduleData.date, scheduleData.courseName, scheduleData.nine, week]
  );
}

// ========== TEE TIMES OPERATIONS ==========

async function getAllTeeTimes() {
  const result = await pool.query(
    'SELECT id, week, team_id as "teamId", day, time FROM tee_times ORDER BY week, day, time'
  );
  return result.rows;
}

async function getTeeTimesByWeek(week) {
  const result = await pool.query(
    'SELECT id, week, team_id as "teamId", day, time FROM tee_times WHERE week = $1 ORDER BY day, time',
    [week]
  );
  return result.rows;
}

async function createTeeTime(teeTimeData) {
  const result = await pool.query(
    'INSERT INTO tee_times (week, team_id, day, time) VALUES ($1, $2, $3, $4) RETURNING id',
    [teeTimeData.week, teeTimeData.teamId, teeTimeData.day, teeTimeData.time]
  );
  return result.rows[0].id;
}

async function deleteTeeTime(id) {
  await pool.query('DELETE FROM tee_times WHERE id = $1', [id]);
}

module.exports = {
  initializeDatabase,
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getAllCourses,
  updateCourse,
  getAllScores,
  createScore,
  updateScore,
  deleteScore,
  getAllHandicaps,
  createOrUpdateHandicap,
  getAllSchedule,
  updateScheduleWeek,
  getAllTeeTimes,
  getTeeTimesByWeek,
  createTeeTime,
  deleteTeeTime
};
