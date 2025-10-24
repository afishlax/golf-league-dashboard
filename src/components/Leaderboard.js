import React from 'react';
import { Card, Table, Row, Col, Badge } from 'react-bootstrap';

function Leaderboard({ teams, scores }) {
  const calculateLeaderboard = () => {
    const teamScores = {};

    // Initialize all teams with player names
    teams.forEach(team => {
      teamScores[team.id] = {
        teamId: team.id,
        teamName: team.name || `Team ${team.id}`,
        player1: team.player1,
        player2: team.player2,
        totalPoints: 0,
        weeksPlayed: 0
      };
    });

    // Calculate scores
    scores.forEach(score => {
      if (teamScores[score.teamId]) {
        teamScores[score.teamId].totalPoints += score.teamTotal || 0;
        teamScores[score.teamId].weeksPlayed += 1;
      }
    });

    // Convert to array and sort
    return Object.values(teamScores)
      .sort((a, b) => {
        // Sort by total points (ascending - lower is better in golf)
        // Teams with no scores go to the bottom
        if (a.weeksPlayed === 0 && b.weeksPlayed === 0) return 0;
        if (a.weeksPlayed === 0) return 1;
        if (b.weeksPlayed === 0) return -1;

        if (a.totalPoints !== b.totalPoints) {
          return a.totalPoints - b.totalPoints;
        }
        // If tied, sort by weeks played (more weeks = more experience)
        return b.weeksPlayed - a.weeksPlayed;
      });
  };

  const leaderboard = calculateLeaderboard();
  const leader = leaderboard.length > 0 && leaderboard[0].weeksPlayed > 0 ? leaderboard[0] : null;
  const weeksCompleted = scores.length > 0
    ? Math.max(...scores.map(s => s.week))
    : 0;
  const totalRounds = scores.length;

  return (
    <div>
      <Row className="mb-4">
        <Col md={4}>
          <Card bg="success" text="white" className="text-center">
            <Card.Body>
              <Card.Title>🏆 Leader</Card.Title>
              <h2>{leader ? leader.teamName : 'TBD'}</h2>
              {leader && (
                <p className="mb-0">Total: {leader.totalPoints} strokes</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg="info" text="white" className="text-center">
            <Card.Body>
              <Card.Title>📅 Weeks Completed</Card.Title>
              <h2>{weeksCompleted}</h2>
              <p className="mb-0">of season</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg="warning" text="dark" className="text-center">
            <Card.Body>
              <Card.Title>⛳ Total Rounds</Card.Title>
              <h2>{totalRounds}</h2>
              <p className="mb-0">submitted</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header as="h5">League Standings</Card.Header>
            <Card.Body>
              {leaderboard.length === 0 ? (
                <div className="text-center text-muted p-5">
                  <h4>No teams registered yet</h4>
                  <p>Teams will appear here once registered.</p>
                </div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Team Name</th>
                      <th>Players</th>
                      <th>Total Strokes</th>
                      <th>Weeks Played</th>
                      <th>Avg per Week</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((team, index) => (
                      <tr key={team.teamId}>
                        <td>
                          {team.weeksPlayed > 0 && index === 0 && (
                            <Badge bg="warning" className="me-2">1st</Badge>
                          )}
                          {team.weeksPlayed > 0 && index === 1 && (
                            <Badge bg="secondary" className="me-2">2nd</Badge>
                          )}
                          {team.weeksPlayed > 0 && index === 2 && (
                            <Badge bg="danger" className="me-2">3rd</Badge>
                          )}
                          {team.weeksPlayed > 0 ? index + 1 : '-'}
                        </td>
                        <td>
                          <strong>{team.teamName}</strong>
                        </td>
                        <td>
                          {team.player1} & {team.player2}
                        </td>
                        <td>{team.weeksPlayed > 0 ? team.totalPoints : '-'}</td>
                        <td>{team.weeksPlayed}</td>
                        <td>
                          {team.weeksPlayed > 0
                            ? (team.totalPoints / team.weeksPlayed).toFixed(1)
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Leaderboard;
