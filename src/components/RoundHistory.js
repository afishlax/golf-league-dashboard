import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';

function RoundHistory({ teams, scores, schedule }) {
  // Create a map of team scores by week
  const getTeamScoresByWeek = () => {
    const teamScoreMap = {};

    // Initialize all teams
    teams.forEach(team => {
      teamScoreMap[team.id] = {
        teamId: team.id,
        teamName: team.name || `Team ${team.id}`,
        player1: team.player1,
        player2: team.player2,
        scoresByWeek: {}
      };
    });

    // Add scores to the map
    scores.forEach(score => {
      if (teamScoreMap[score.teamId]) {
        teamScoreMap[score.teamId].scoresByWeek[score.week] = {
          courseName: score.courseName,
          nine: score.nine,
          player1Score: score.player1Score,
          player2Score: score.player2Score,
          teamTotal: score.teamTotal,
          date: score.date
        };
      }
    });

    return Object.values(teamScoreMap);
  };

  const teamHistory = getTeamScoresByWeek();

  // Get unique weeks from schedule
  const weeks = schedule.map(s => s.week).sort((a, b) => a - b);

  return (
    <div>
      <Card>
        <Card.Header as="h5">Round History - Week by Week Performance</Card.Header>
        <Card.Body>
          {teamHistory.length === 0 ? (
            <div className="text-center text-muted p-5">
              <h4>No teams registered yet</h4>
              <p>Round history will appear once teams are registered and scores are submitted.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th style={{ position: 'sticky', left: 0, background: 'white', zIndex: 1 }}>Team</th>
                    <th style={{ position: 'sticky', left: 0, background: 'white', zIndex: 1 }}>Players</th>
                    {weeks.map(week => {
                      const scheduleItem = schedule.find(s => s.week === week);
                      return (
                        <th key={week} className="text-center" style={{ minWidth: '120px' }}>
                          <div>Week {week}</div>
                          {scheduleItem && (
                            <>
                              <small className="text-muted d-block">{scheduleItem.courseName}</small>
                              <Badge bg="secondary" className="mt-1">{scheduleItem.nine === 'F' ? 'Front 9' : 'Back 9'}</Badge>
                            </>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {teamHistory.map(team => (
                    <tr key={team.teamId}>
                      <td style={{ position: 'sticky', left: 0, background: 'white', fontWeight: 'bold' }}>
                        {team.teamName}
                      </td>
                      <td style={{ position: 'sticky', left: 0, background: 'white' }}>
                        <small>{team.player1} & {team.player2}</small>
                      </td>
                      {weeks.map(week => {
                        const weekScore = team.scoresByWeek[week];
                        return (
                          <td key={week} className="text-center">
                            {weekScore ? (
                              <div>
                                <strong className="d-block">{weekScore.teamTotal}</strong>
                                <small className="text-muted">
                                  ({weekScore.player1Score} / {weekScore.player2Score})
                                </small>
                              </div>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          <div className="mt-3">
            <small className="text-muted">
              <strong>Note:</strong> Team Total shown with individual scores in parentheses (Player 1 / Player 2)
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default RoundHistory;
