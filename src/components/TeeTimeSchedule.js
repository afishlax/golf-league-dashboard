import React, { useState, useEffect } from 'react';
import { Card, Form, Table, Button, Row, Col, Badge, Alert } from 'react-bootstrap';
import * as api from '../services/api';

function TeeTimeSchedule({ teams, schedule }) {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teeTimes, setTeeTimes] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Define time slots
  const timeSlots = {
    'Monday': ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'],
    'Tuesday': ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'],
    'Wednesday': ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'],
    'Thursday': ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'],
    'Friday': ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM']
  };

  const days = Object.keys(timeSlots);

  useEffect(() => {
    loadTeeTimes();
  }, [selectedWeek]);

  const loadTeeTimes = async () => {
    try {
      const data = await api.fetchTeeTimesByWeek(selectedWeek);
      setTeeTimes(data);
    } catch (err) {
      console.error('Error loading tee times:', err);
    }
  };

  const getTeamsForTimeSlot = (day, time) => {
    const bookedTeeTimes = teeTimes.filter(t => t.day === day && t.time === time);
    return bookedTeeTimes.map(teeTime => {
      return teams.find(t => t.id === Number(teeTime.teamId));
    }).filter(team => team !== undefined);
  };

  const isTeamAlreadyBooked = () => {
    return teeTimes.some(t => t.teamId === Number(selectedTeamId));
  };

  const handleBookTeeTime = async (day, time) => {
    if (!selectedTeamId) {
      setError('Please select a team first');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Check if team already has a tee time this week
    if (isTeamAlreadyBooked()) {
      setError('Your team has already booked a tee time for this week. Contact admin to make changes.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    // Check if slot is full (2 teams maximum)
    const bookedTeams = getTeamsForTimeSlot(day, time);
    if (bookedTeams.length >= 2) {
      setError('This time slot is full (2 teams maximum)');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      await api.createTeeTime({
        week: selectedWeek,
        teamId: Number(selectedTeamId),
        day,
        time
      });
      setMessage('Tee time booked successfully!');
      setTimeout(() => setMessage(''), 3000);
      loadTeeTimes();
    } catch (err) {
      setError('Failed to book tee time');
      setTimeout(() => setError(''), 3000);
    }
  };

  const selectedSchedule = schedule.find(s => s.week === selectedWeek);

  return (
    <div>
      <Card className="mb-3">
        <Card.Header as="h5">Tee Time Schedule</Card.Header>
        <Card.Body>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Select Week</Form.Label>
                <Form.Select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                >
                  {schedule.map(week => (
                    <option key={week.week} value={week.week}>
                      Week {week.week} - {week.date}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Select Your Team</Form.Label>
                <Form.Select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  disabled={isTeamAlreadyBooked()}
                >
                  <option value="">Choose your team...</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.player1} & {team.player2})
                    </option>
                  ))}
                </Form.Select>
                {isTeamAlreadyBooked() && (
                  <Form.Text className="text-warning">
                    Team already booked for this week
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          {selectedSchedule && (
            <Alert variant="info">
              <strong>Week {selectedSchedule.week}:</strong> {selectedSchedule.courseName} - {' '}
              <Badge bg="secondary">{selectedSchedule.nine === 'F' ? 'Front 9' : 'Back 9'}</Badge>
              {' '} on {selectedSchedule.date}
            </Alert>
          )}

          <div className="table-responsive">
            <Table bordered hover size="sm">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Day / Time</th>
                  {days.map(day => (
                    <th key={day} className="text-center">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots[days[0]].map((time, timeIndex) => (
                  <tr key={time}>
                    <td><strong>{time}</strong></td>
                    {days.map(day => {
                      // Check if this time slot exists for this day
                      const hasTimeSlot = timeSlots[day].includes(time);
                      if (!hasTimeSlot) {
                        return <td key={day} className="bg-light"></td>;
                      }

                      const bookedTeams = getTeamsForTimeSlot(day, time);

                      if (bookedTeams.length === 2) {
                        // Full - 2 teams booked
                        return (
                          <td key={day} className="text-center bg-danger bg-opacity-10">
                            <div className="p-2">
                              <Badge bg="danger" className="mb-1">FULL</Badge>
                              {bookedTeams.map((team, idx) => (
                                <div key={idx}>
                                  <small>
                                    <strong>{team.name}</strong><br />
                                    <span className="text-muted">{team.player1} & {team.player2}</span>
                                  </small>
                                  {idx === 0 && <hr className="my-1" />}
                                </div>
                              ))}
                            </div>
                          </td>
                        );
                      }

                      if (bookedTeams.length === 1) {
                        // Partially full - 1 team booked, 1 spot left
                        return (
                          <td key={day} className="text-center bg-success bg-opacity-10">
                            <div className="p-2">
                              <Badge bg="success" className="mb-1">1 Spot Left</Badge>
                              <div>
                                <small>
                                  <strong>{bookedTeams[0].name}</strong><br />
                                  <span className="text-muted">{bookedTeams[0].player1} & {bookedTeams[0].player2}</span>
                                </small>
                              </div>
                              <Button
                                size="sm"
                                variant="outline-success"
                                className="mt-2"
                                onClick={() => handleBookTeeTime(day, time)}
                                disabled={!selectedTeamId || isTeamAlreadyBooked()}
                              >
                                Book 2nd Slot
                              </Button>
                            </div>
                          </td>
                        );
                      }

                      // Available - no teams booked
                      return (
                        <td key={day} className="text-center">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleBookTeeTime(day, time)}
                            disabled={!selectedTeamId || isTeamAlreadyBooked()}
                          >
                            Book
                          </Button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <Alert variant="secondary" className="mt-3">
            <strong>Instructions:</strong>
            <ul className="mb-0">
              <li>Select your team from the dropdown above</li>
              <li>Each time slot can accommodate up to 2 teams</li>
              <li>Click "Book" on any available time slot to reserve it</li>
              <li>Green slots have 1 spot remaining - you can book the 2nd slot</li>
              <li>Red slots are full with 2 teams already booked</li>
              <li>Once booked, you cannot change your tee time - contact admin for changes</li>
            </ul>
          </Alert>
        </Card.Body>
      </Card>
    </div>
  );
}

export default TeeTimeSchedule;
