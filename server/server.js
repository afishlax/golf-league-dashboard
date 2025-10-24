const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { db, initializeDatabase, importInitialData } = require('./database');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database before starting server
(async () => {
  await initializeDatabase();
  await importInitialData();
})();

// ========== TEAMS ENDPOINTS ==========

// Get all teams
app.get('/api/teams', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM teams ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single team
app.get('/api/teams/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM teams WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new team
app.post('/api/teams', async (req, res) => {
  try {
    const { name, player1, player2, paymentStatus } = req.body;
    const result = await db.query(
      'INSERT INTO teams (name, player1, player2, paymentStatus) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, player1, player2, paymentStatus || 'Not Paid']
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update team
app.put('/api/teams/:id', async (req, res) => {
  try {
    const { name, player1, player2, paymentStatus } = req.body;
    await db.query(
      'UPDATE teams SET name = $1, player1 = $2, player2 = $3, paymentStatus = $4 WHERE id = $5',
      [name, player1, player2, paymentStatus, req.params.id]
    );
    res.json({ message: 'Team updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete team
app.delete('/api/teams/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM teams WHERE id = $1', [req.params.id]);
    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== COURSES ENDPOINTS ==========

// Get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM courses');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== SCORES ENDPOINTS ==========

// Get all scores
app.get('/api/scores', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM scores ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new score
app.post('/api/scores', async (req, res) => {
  try {
    const { teamId, courseName, week, date, player1Score, player2Score, teamTotal } = req.body;
    const result = await db.query(
      'INSERT INTO scores (teamId, courseName, week, date, player1Score, player2Score, teamTotal) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [teamId, courseName, week, date, player1Score, player2Score, teamTotal]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== HANDICAPS ENDPOINTS ==========

// Get all handicaps
app.get('/api/handicaps', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM handicaps ORDER BY playerName');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update handicap
app.post('/api/handicaps', async (req, res) => {
  try {
    const { playerName, handicapIndex } = req.body;
    const result = await db.query(
      'INSERT INTO handicaps (playerName, handicapIndex) VALUES ($1, $2) ON CONFLICT (playerName) DO UPDATE SET handicapIndex = $2 RETURNING id',
      [playerName, handicapIndex]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
