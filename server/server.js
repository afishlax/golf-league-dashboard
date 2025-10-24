const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const handicapCalc = require('./handicap-calculator');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database before starting server
async function startServer() {
  try {
    await db.initializeDatabase();

    // Start server after database is ready
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

// ========== TEAMS ENDPOINTS ==========

// Get all teams
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await db.getAllTeams();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single team
app.get('/api/teams/:id', async (req, res) => {
  try {
    const team = await db.getTeamById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new team
app.post('/api/teams', async (req, res) => {
  try {
    const { name, player1, player2, player1Payment, player2Payment } = req.body;
    const id = await db.createTeam({ name, player1, player2, player1Payment, player2Payment });
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update team
app.put('/api/teams/:id', async (req, res) => {
  try {
    const { name, player1, player2, player1Payment, player2Payment } = req.body;
    await db.updateTeam(req.params.id, { name, player1, player2, player1Payment, player2Payment });
    res.json({ message: 'Team updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete team
app.delete('/api/teams/:id', async (req, res) => {
  try {
    await db.deleteTeam(req.params.id);
    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== COURSES ENDPOINTS ==========

// Get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await db.getAllCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== SCHEDULE ENDPOINTS ==========

// Get all schedule
app.get('/api/schedule', async (req, res) => {
  try {
    const schedule = await db.getAllSchedule();
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== SCORES ENDPOINTS ==========

// Get all scores
app.get('/api/scores', async (req, res) => {
  try {
    const scores = await db.getAllScores();
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new score
app.post('/api/scores', async (req, res) => {
  try {
    const { teamId, courseName, week, date, nine, player1Score, player2Score, teamTotal } = req.body;
    const id = await db.createScore({ teamId, courseName, week, date, nine, player1Score, player2Score, teamTotal });

    // Auto-calculate handicaps after adding score (if week >= 4)
    if (week >= 4) {
      await recalculateAllHandicaps();
    }

    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update score
app.put('/api/scores/:id', async (req, res) => {
  try {
    const { teamId, courseName, week, date, nine, player1Score, player2Score, teamTotal } = req.body;
    await db.updateScore(req.params.id, { teamId, courseName, week, date, nine, player1Score, player2Score, teamTotal });

    // Recalculate handicaps after updating score
    if (week >= 4) {
      await recalculateAllHandicaps();
    }

    res.json({ message: 'Score updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete score
app.delete('/api/scores/:id', async (req, res) => {
  try {
    await db.deleteScore(req.params.id);
    // Recalculate handicaps after deleting score
    await recalculateAllHandicaps();
    res.json({ message: 'Score deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== HANDICAPS ENDPOINTS ==========

// Get all handicaps
app.get('/api/handicaps', async (req, res) => {
  try {
    const handicaps = await db.getAllHandicaps();
    res.json(handicaps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update handicap
app.post('/api/handicaps', async (req, res) => {
  try {
    const { playerName, handicapIndex } = req.body;
    await db.createOrUpdateHandicap({ playerName, handicapIndex });
    res.json({ message: 'Handicap saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recalculate all handicaps based on scores
app.post('/api/handicaps/recalculate', async (req, res) => {
  try {
    await recalculateAllHandicaps();
    const handicaps = await db.getAllHandicaps();
    res.json({ message: 'Handicaps recalculated successfully', handicaps });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== TEE TIMES ENDPOINTS ==========

// Get all tee times
app.get('/api/teetimes', async (req, res) => {
  try {
    const teeTimes = await db.getAllTeeTimes();
    res.json(teeTimes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tee times by week
app.get('/api/teetimes/week/:week', async (req, res) => {
  try {
    const teeTimes = await db.getTeeTimesByWeek(req.params.week);
    res.json(teeTimes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create tee time
app.post('/api/teetimes', async (req, res) => {
  try {
    const { week, teamId, day, time } = req.body;
    const id = await db.createTeeTime({ week, teamId, day, time });
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete tee time
app.delete('/api/teetimes/:id', async (req, res) => {
  try {
    await db.deleteTeeTime(req.params.id);
    res.json({ message: 'Tee time deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== COURSES UPDATE ENDPOINT ==========

// Update course
app.put('/api/courses/:name', async (req, res) => {
  try {
    const { name, par, slope, rating } = req.body;
    await db.updateCourse(req.params.name, { name, par, slope, rating });
    res.json({ message: 'Course updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== SCHEDULE UPDATE ENDPOINT ==========

// Update schedule week
app.put('/api/schedule/:week', async (req, res) => {
  try {
    const { date, courseName, nine } = req.body;
    await db.updateScheduleWeek(req.params.week, { date, courseName, nine });
    res.json({ message: 'Schedule updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function to recalculate all handicaps
async function recalculateAllHandicaps() {
  const teams = await db.getAllTeams();
  const scores = await db.getAllScores();
  const courses = await db.getAllCourses();

  const handicaps = handicapCalc.calculateHandicaps(teams, scores, courses);

  // Update all handicaps in the database
  for (const [playerName, handicapIndex] of Object.entries(handicaps)) {
    await db.createOrUpdateHandicap({ playerName, handicapIndex });
  }
}
