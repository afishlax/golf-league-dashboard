const { Pool } = require('pg');

// Use environment variable for database connection, fallback to local for development
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initializeDatabase(callback) {
  try {
    // Teams table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY,
        name TEXT,
        player1 TEXT NOT NULL,
        player2 TEXT NOT NULL,
        paymentStatus TEXT DEFAULT 'Not Paid'
      )
    `);

    // Courses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        par INTEGER NOT NULL,
        slope INTEGER NOT NULL,
        rating REAL NOT NULL
      )
    `);

    // Scores table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scores (
        id SERIAL PRIMARY KEY,
        teamId INTEGER NOT NULL,
        courseName TEXT NOT NULL,
        week INTEGER NOT NULL,
        date TEXT NOT NULL,
        player1Score INTEGER NOT NULL,
        player2Score INTEGER NOT NULL,
        teamTotal INTEGER NOT NULL,
        FOREIGN KEY (teamId) REFERENCES teams(id)
      )
    `);

    // Handicaps table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS handicaps (
        id SERIAL PRIMARY KEY,
        playerName TEXT NOT NULL UNIQUE,
        handicapIndex REAL NOT NULL
      )
    `);

    console.log('Database initialized successfully');
    if (callback) callback();
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// Import initial data from JSON file
async function importInitialData() {
  try {
    const leagueData = require('../golf-league-data.json');

    // Check if teams already exist
    const result = await pool.query('SELECT COUNT(*) as count FROM teams');
    const count = parseInt(result.rows[0].count);

    if (count === 0) {
      console.log('Importing initial data...');

      // Import teams
      for (const team of leagueData.teams) {
        await pool.query(
          'INSERT INTO teams (id, name, player1, player2, paymentStatus) VALUES ($1, $2, $3, $4, $5)',
          [team.id, team.name, team.player1, team.player2, team.paymentStatus]
        );
      }

      // Import courses
      for (const course of leagueData.courses) {
        await pool.query(
          'INSERT INTO courses (name, par, slope, rating) VALUES ($1, $2, $3, $4)',
          [course.name, course.par, course.slope, course.rating]
        );
      }

      console.log('Initial data imported successfully');
    }
  } catch (err) {
    console.error('Error importing initial data:', err);
  }
}

module.exports = {
  db: pool,
  initializeDatabase,
  importInitialData
};
