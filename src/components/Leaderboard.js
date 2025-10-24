import React from 'react';
import { Card, Table, Row, Col, Badge } from 'react-bootstrap';

function Leaderboard({ teams, scores }) {
  const calculateLeaderboard = () => {
    const teamScores = {};

    // Initialize all teams
    teams.forEach(team => {
      teamScores[team.id] = {
        teamName: team.name,
        totalPoints: 0,
        weeksPlayed: 0
      };
    });

    // Calculate scores
    scores.forEach(score => {
      if (teamScores[score.teamId]) {
        teamScores[score.teamId].totalPoints += score.teamScore;
        teamScores[score.teamId].weeksPlayed += 1;
      }
    });

    // Convert to array and sort
    return Object.values(teamScores)
      .sort((a, b) => {
        // Sort by total points (ascending - lower is better in golf)
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
              {leaderboard.filter(team => team.weeksPlayed > 0).length === 0 ? (
                <div className="text-center text-muted p-5">
                  <h4>No scores recorded yet</h4>
                  <p>The leaderboard will appear once teams start submitting scores.</p>
                </div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Team Name</th>
                      <th>Total Strokes</th>
                      <th>Weeks Played</th>
                      <th>Avg per Week</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard
                      .filter(team => team.weeksPlayed > 0)
                      .map((team, index) => (
                        <tr key={team.teamName}>
                          <td>
                            {index === 0 && (
                              <Badge bg="warning" className="me-2">1st</Badge>
                            )}
                            {index === 1 && (
                              <Badge bg="secondary" className="me-2">2nd</Badge>
                            )}
                            {index === 2 && (
                              <Badge bg="danger" className="me-2">3rd</Badge>
                            )}
                            {index + 1}
                          </td>
                          <td>
                            <strong>{team.teamName}</strong>
                          </td>
                          <td>{team.totalPoints}</td>
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
