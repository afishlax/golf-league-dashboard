import React, { useState, useEffect } from 'react';
import { Card, Form, Table, Row, Col, Badge, Alert } from 'react-bootstrap';
import * as api from '../services/api';

function MySchedule({ teams, schedule, scores }) {
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teeTimes, setTeeTimes] = useState([]);

  useEffect(() => {
    loadTeeTimes();
  }, []);

  const loadTeeTimes = async () => {
    try {
      const data = await api.fetchTeeTimes();
      setTeeTimes(data);
    } catch (err) {
      console.error('Error loading tee times:', err);
    }
  };

  // Get schedule info for a specific week
  const getScheduleInfo = (week) => {
    return schedule.find(s => s.week === week);
  };

  // Get team name and players for display
  const getTeamInfo = (teamId) => {
    return teams.find(t => t.id === Number(teamId));
  };

  // Get score for a specific week and team
  const getScoreForWeek = (week, teamId) => {
    return scores.find(s => s.week === week && s.teamId === Number(teamId));
  };

  // Filter tee times for selected team
  const getMyTeeTimes = () => {
    if (!selectedTeamId) return [];

    const myBookings = teeTimes.filter(t => t.teamId === Number(selectedTeamId));

    // Sort by week
    return myBookings.sort((a, b) => a.week - b.week);
  };

  const myTeeTimes = getMyTeeTimes();
  const selectedTeam = selectedTeamId ? getTeamInfo(Number(selectedTeamId)) : null;

  return (
    <div>
      <Card className="mb-3">
        <Card.Header as="h5">My Tee Time Schedule</Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Select Your Team</Form.Label>
                <Form.Select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                >
                  <option value="">Choose your team...</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.player1} & {team.player2})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {selectedTeamId && selectedTeam && (
            <>
              <Alert variant="info">
                <strong>Schedule for:</strong> {selectedTeam.name}
                <br />
                <strong>Players:</strong> {selectedTeam.player1} & {selectedTeam.player2}
              </Alert>

              {myTeeTimes.length === 0 ? (
                <Alert variant="warning">
                  No tee times booked yet. Visit the "Book Tee Time" tab to schedule your rounds.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Week</th>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Tee Time</th>
                        <th>Course</th>
                        <th>Nine</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myTeeTimes.map((teeTime) => {
                        const scheduleInfo = getScheduleInfo(teeTime.week);
                        const scoreInfo = getScoreForWeek(teeTime.week, selectedTeamId);
                        return (
                          <tr key={teeTime.id}>
                            <td><strong>Week {teeTime.week}</strong></td>
                            <td>{scheduleInfo ? scheduleInfo.date : '-'}</td>
                            <td>
                              <Badge bg="primary">{teeTime.day}</Badge>
                            </td>
                            <td>
                              <strong style={{ fontSize: '1.1em' }}>{teeTime.time}</strong>
                            </td>
                            <td>{scheduleInfo ? scheduleInfo.courseName : '-'}</td>
                            <td>
                              <Badge bg="secondary">
                                {scheduleInfo && scheduleInfo.nine === 'F' ? 'Front 9' : 'Back 9'}
                              </Badge>
                            </td>
                            <td className="text-center">
                              {scoreInfo ? (
                                <div>
                                  <Badge bg="success" style={{ fontSize: '1.1em' }}>
                                    {scoreInfo.teamScore}
                                  </Badge>
                                </div>
                              ) : (
                                <Badge bg="warning" text="dark">Not Played</Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}

              {myTeeTimes.length > 0 && (
                <Alert variant="secondary" className="mt-3">
                  <strong>Total Scheduled:</strong> {myTeeTimes.length} tee time{myTeeTimes.length !== 1 ? 's' : ''}
                </Alert>
              )}
            </>
          )}

          {!selectedTeamId && (
            <div className="text-center text-muted p-5">
              <h4>Select Your Team</h4>
              <p>Choose your team from the dropdown above to view your scheduled tee times.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default MySchedule;
