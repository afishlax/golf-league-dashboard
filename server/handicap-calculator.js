// Handicap Calculator for 2-Man Scramble - Full Season Average
//
// In a 2-man scramble format, each team has ONE score and ONE handicap
// Handicap is calculated based on the team's combined performance over the entire season

/**
 * Calculate handicaps for all teams based on ALL their scores for the season
 * Uses simplified handicap formula: Average differential over all rounds
 * Differential = (Team Score - Course Rating) * 113 / Slope
 */

async function calculateHandicaps(teams, scores, courses) {
  const handicaps = {};

  // Calculate handicap for each team
  for (const team of teams) {
    const teamScores = getTeamScores(team.id, scores, courses);

    // Need at least 1 score to calculate handicap
    if (teamScores.length >= 1) {
      // Use ALL scores for the season
      const allScores = teamScores;

      // Calculate average differential across all rounds
      const avgDifferential = allScores.reduce((sum, score) => sum + score.differential, 0) / allScores.length;

      // Handicap Index = average differential * 0.96 (standard USGA multiplier)
      const handicapIndex = Math.round(avgDifferential * 0.96 * 10) / 10;

      handicaps[team.id] = {
        teamId: team.id,
        teamName: team.name || `Team ${team.id}`,
        handicapIndex: handicapIndex,
        roundsPlayed: allScores.length
      };
    }
  }

  return handicaps;
}

/**
 * Get all scores for a specific team with calculated differentials
 */
function getTeamScores(teamId, scores, courses) {
  const teamScores = [];

  scores.forEach(score => {
    // Check if this score belongs to this team
    if (score.teamId !== teamId) return;

    // Find the course info
    const course = courses.find(c => c.name === score.courseName);
    if (!course) return;

    if (score.teamScore !== null && score.teamScore !== undefined) {
      // Calculate differential: (Team Score - Rating) * 113 / Slope
      const differential = (score.teamScore - course.rating) * 113 / course.slope;

      teamScores.push({
        week: score.week,
        date: score.date,
        score: score.teamScore,
        courseName: score.courseName,
        courseRating: course.rating,
        courseSlope: course.slope,
        differential: differential
      });
    }
  });

  // Sort by week
  return teamScores.sort((a, b) => a.week - b.week);
}

/**
 * Get handicap for a specific team (or null if not enough data)
 */
function getTeamHandicap(teamId, teams, scores, courses) {
  const teamScores = getTeamScores(teamId, scores, courses);

  if (teamScores.length < 4) {
    return null;
  }

  // Get last 4 scores
  const recentScores = teamScores.slice(-4);

  // Calculate average differential
  const avgDifferential = recentScores.reduce((sum, score) => sum + score.differential, 0) / 4;

  // Handicap Index = average differential * 0.96
  return Math.round(avgDifferential * 0.96 * 10) / 10;
}

/**
 * Calculate course handicap for a team on a specific course
 * Course Handicap = Handicap Index * Slope / 113
 */
function calculateCourseHandicap(handicapIndex, courseSlope) {
  if (!handicapIndex) return 0;
  return Math.round(handicapIndex * courseSlope / 113);
}

module.exports = {
  calculateHandicaps,
  getTeamHandicap,
  getTeamScores,
  calculateCourseHandicap
};
