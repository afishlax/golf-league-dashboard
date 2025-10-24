const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { db, initializeDatabase, importInitialData } = require('./database');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database before starting server
initializeDatabase(() => {
  importInitialData();
});

// ========== TEAMS ENDPOINTS ==========

// Get all teams
app.get('/api/teams', (req, res) => {
  db.all('SELECT * FROM teams ORDER BY id', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single team
app.get('/api/teams/:id', (req, res) => {
  db.get('SELECT * FROM teams WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Create new team
app.post('/api/teams', (req, res) => {
  const { name, player1, player2, paymentStatus } = req.body;
  db.run(
    'INSERT INTO teams (name, player1, player2, paymentStatus) VALUES (?, ?, ?, ?)',
    [name, player1, player2, paymentStatus || 'Not Paid'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Update team
app.put('/api/teams/:id', (req, res) => {
  const { name, player1, player2, paymentStatus } = req.body;
  db.run(
    'UPDATE teams SET name = ?, player1 = ?, player2 = ?, paymentStatus = ? WHERE id = ?',
    [name, player1, player2, paymentStatus, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Team updated successfully' });
    }
  );
});

// Delete team
app.delete('/api/teams/:id', (req, res) => {
  db.run('DELETE FROM teams WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Team deleted successfully' });
  });
});

// ========== COURSES ENDPOINTS ==========

// Get all courses
app.get('/api/courses', (req, res) => {
  db.all('SELECT * FROM courses', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// ========== SCORES ENDPOINTS ==========

// Get all scores
app.get('/api/scores', (req, res) => {
  db.all('SELECT * FROM scores ORDER BY date DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new score
app.post('/api/scores', (req, res) => {
  const { teamId, courseName, week, date, player1Score, player2Score, teamTotal } = req.body;
  db.run(
    'INSERT INTO scores (teamId, courseName, week, date, player1Score, player2Score, teamTotal) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [teamId, courseName, week, date, player1Score, player2Score, teamTotal],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// ========== HANDICAPS ENDPOINTS ==========

// Get all handicaps
app.get('/api/handicaps', (req, res) => {
  db.all('SELECT * FROM handicaps ORDER BY playerName', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create or update handicap
app.post('/api/handicaps', (req, res) => {
  const { playerName, handicapIndex } = req.body;
  db.run(
    'INSERT OR REPLACE INTO handicaps (playerName, handicapIndex) VALUES (?, ?)',
    [playerName, handicapIndex],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
