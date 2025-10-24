// Handicap Calculator - 4-week rolling average

/**
 * Calculate handicaps for all players based on their last 4 weeks of scores
 * Uses simplified handicap formula: Average differential over last 4 weeks
 * Differential = (Score - Course Rating) * 113 / Slope
 */

async function calculateHandicaps(teams, scores, courses) {
  const handicaps = {};

  // Get all unique player names
  const players = new Set();
  teams.forEach(team => {
    if (team.player1) players.add(team.player1);
    if (team.player2) players.add(team.player2);
  });

  // Calculate handicap for each player
  for (const playerName of players) {
    const playerScores = getPlayerScores(playerName, teams, scores, courses);

    // Need at least 4 scores to calculate handicap
    if (playerScores.length >= 4) {
      // Get last 4 scores
      const recentScores = playerScores.slice(-4);

      // Calculate average differential
      const avgDifferential = recentScores.reduce((sum, score) => sum + score.differential, 0) / 4;

      // Handicap Index = average differential * 0.96 (standard USGA multiplier)
      const handicapIndex = Math.round(avgDifferential * 0.96 * 10) / 10;

      handicaps[playerName] = handicapIndex;
    }
  }

  return handicaps;
}

/**
 * Get all scores for a specific player with calculated differentials
 */
function getPlayerScores(playerName, teams, scores, courses) {
  const playerScores = [];

  scores.forEach(score => {
    // Find the team this score belongs to
    const team = teams.find(t => t.id === score.teamId);
    if (!team) return;

    // Find the course info
    const course = courses.find(c => c.name === score.courseName);
    if (!course) return;

    // Check if this player is player1 or player2
    let playerScore = null;
    if (team.player1 === playerName) {
      playerScore = score.player1Score;
    } else if (team.player2 === playerName) {
      playerScore = score.player2Score;
    }

    if (playerScore !== null && playerScore !== undefined) {
      // Calculate differential: (Score - Rating) * 113 / Slope
      const differential = (playerScore - course.rating) * 113 / course.slope;

      playerScores.push({
        week: score.week,
        date: score.date,
        score: playerScore,
        courseName: score.courseName,
        courseRating: course.rating,
        courseSlope: course.slope,
        differential: differential
      });
    }
  });

  // Sort by week
  return playerScores.sort((a, b) => a.week - b.week);
}

/**
 * Get handicap for a specific player (or null if not enough data)
 */
function getPlayerHandicap(playerName, teams, scores, courses) {
  const playerScores = getPlayerScores(playerName, teams, scores, courses);

  if (playerScores.length < 4) {
    return null;
  }

  // Get last 4 scores
  const recentScores = playerScores.slice(-4);

  // Calculate average differential
  const avgDifferential = recentScores.reduce((sum, score) => sum + score.differential, 0) / 4;

  // Handicap Index = average differential * 0.96
  return Math.round(avgDifferential * 0.96 * 10) / 10;
}

/**
 * Calculate course handicap for a player on a specific course
 * Course Handicap = Handicap Index * Slope / 113
 */
function calculateCourseHandicap(handicapIndex, courseSlope) {
  if (!handicapIndex) return 0;
  return Math.round(handicapIndex * courseSlope / 113);
}

module.exports = {
  calculateHandicaps,
  getPlayerHandicap,
  getPlayerScores,
  calculateCourseHandicap
};
