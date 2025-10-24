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

  const getTeamForTimeSlot = (day, time) => {
    const teeTime = teeTimes.find(t => t.day === day && t.time === time);
    if (teeTime) {
      const team = teams.find(t => t.id === Number(teeTime.teamId));
      return team;
    }
    return null;
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

    // Check if slot is already taken
    if (getTeamForTimeSlot(day, time)) {
      setError('This time slot is already taken');
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

                      const bookedTeam = getTeamForTimeSlot(day, time);

                      if (bookedTeam) {
                        return (
                          <td key={day} className="text-center bg-warning bg-opacity-25">
                            <div className="p-2">
                              <small>
                                <strong>{bookedTeam.name}</strong><br />
                                {bookedTeam.player1} & {bookedTeam.player2}
                              </small>
                            </div>
                          </td>
                        );
                      }

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
              <li>Click "Book" on any available time slot to reserve it</li>
              <li>Once booked, you cannot change your tee time - contact admin for changes</li>
              <li>Yellow slots are already booked by other teams</li>
            </ul>
          </Alert>
        </Card.Body>
      </Card>
    </div>
  );
}

export default TeeTimeSchedule;
