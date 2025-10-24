const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file in server directory
const dbPath = path.join(__dirname, 'golf-league.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
function initializeDatabase(callback) {
  db.serialize(() => {
    // Teams table
    db.run(`
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY,
        name TEXT,
        player1 TEXT NOT NULL,
        player2 TEXT NOT NULL,
        paymentStatus TEXT DEFAULT 'Not Paid'
      )
    `);

    // Courses table
    db.run(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        par INTEGER NOT NULL,
        slope INTEGER NOT NULL,
        rating REAL NOT NULL
      )
    `);

    // Scores table
    db.run(`
      CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    db.run(`
      CREATE TABLE IF NOT EXISTS handicaps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playerName TEXT NOT NULL UNIQUE,
        handicapIndex REAL NOT NULL
      )
    `);

    console.log('Database initialized successfully');
    if (callback) callback();
  });
}

// Import initial data from JSON file
function importInitialData() {
  const leagueData = require('../src/golf-league-data.json');

  // Check if teams already exist
  db.get('SELECT COUNT(*) as count FROM teams', (err, row) => {
    if (err) {
      console.error('Error checking teams:', err);
      return;
    }

    if (row.count === 0) {
      console.log('Importing initial data...');

      // Import teams
      const teamStmt = db.prepare('INSERT INTO teams (id, name, player1, player2, paymentStatus) VALUES (?, ?, ?, ?, ?)');
      leagueData.teams.forEach(team => {
        teamStmt.run(team.id, team.name, team.player1, team.player2, team.paymentStatus);
      });
      teamStmt.finalize();

      // Import courses
      const courseStmt = db.prepare('INSERT INTO courses (name, par, slope, rating) VALUES (?, ?, ?, ?)');
      leagueData.courses.forEach(course => {
        courseStmt.run(course.name, course.par, course.slope, course.rating);
      });
      courseStmt.finalize();

      console.log('Initial data imported successfully');
    }
  });
}

module.exports = {
  db,
  initializeDatabase,
  importInitialData
};
