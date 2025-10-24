import React, { useState } from 'react';
import { Card, Form, Button, Table, Row, Col, Alert } from 'react-bootstrap';

function Scorecard({ teams, courses, scores, schedule, onAddScore }) {
  const [formData, setFormData] = useState({
    teamId: teams.length > 0 ? teams[0].id : '',
    courseName: courses.length > 0 ? courses[0].name : '',
    week: 1,
    date: new Date().toISOString().split('T')[0],
    nine: 'F',
    player1Score: 36,
    player2Score: 36
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newScore = {
      id: Date.now(),
      teamId: parseInt(formData.teamId),
      courseName: formData.courseName,
      week: parseInt(formData.week),
      date: formData.date,
      nine: formData.nine,
      player1Score: parseInt(formData.player1Score),
      player2Score: parseInt(formData.player2Score),
      teamTotal: parseInt(formData.player1Score) + parseInt(formData.player2Score)
    };

    onAddScore(newScore);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If week is changed, auto-populate course and nine from schedule
    if (name === 'week' && schedule && schedule.length > 0) {
      const scheduleItem = schedule.find(s => s.week === parseInt(value));
      if (scheduleItem) {
        setFormData({
          ...formData,
          week: value,
          courseName: scheduleItem.courseName,
          nine: scheduleItem.nine,
          date: scheduleItem.date
        });
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const teamTotal = parseInt(formData.player1Score || 0) + parseInt(formData.player2Score || 0);

  // Get team name for displaying in score history
  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Unknown';
  };

  return (
    <div>
      <Row>
        <Col md={12} lg={6}>
          <Card className="mb-3">
            <Card.Header as="h5">Submit Your Score</Card.Header>
            <Card.Body>
              {showSuccess && (
                <Alert variant="success">Score submitted successfully!</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Team</Form.Label>
                      <Form.Select
                        name="teamId"
                        value={formData.teamId}
                        onChange={handleChange}
                        required
                      >
                        {teams.map(team => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Course</Form.Label>
                      <Form.Select
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleChange}
                        required
                      >
                        {courses.map(course => (
                          <option key={course.name} value={course.name}>
                            {course.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Week</Form.Label>
                      <Form.Control
                        type="number"
                        name="week"
                        value={formData.week}
                        onChange={handleChange}
                        min="1"
                        max="16"
                        required
                      />
                      <Form.Text className="text-muted">
                        Auto-populates course & nine
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nine</Form.Label>
                      <Form.Select
                        name="nine"
                        value={formData.nine}
                        onChange={handleChange}
                        required
                      >
                        <option value="F">Front 9</option>
                        <option value="B">Back 9</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Player 1 Score</Form.Label>
                      <Form.Control
                        type="number"
                        name="player1Score"
                        value={formData.player1Score}
                        onChange={handleChange}
                        min="50"
                        max="150"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Player 2 Score</Form.Label>
                      <Form.Control
                        type="number"
                        name="player2Score"
                        value={formData.player2Score}
                        onChange={handleChange}
                        min="50"
                        max="150"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Team Total</Form.Label>
                      <Form.Control
                        type="text"
                        value={teamTotal}
                        readOnly
                        style={{ fontWeight: 'bold', fontSize: '1.2em' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" type="submit" size="lg" className="w-100">
                  Submit Score
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12} lg={6}>
          <Card className="mb-3">
            <Card.Header as="h5">Recent Scores</Card.Header>
            <Card.Body>
              {scores.length === 0 ? (
                <p className="text-muted">No scores recorded yet. Submit your first score!</p>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Week</th>
                        <th>Team</th>
                        <th>Course</th>
                        <th>Nine</th>
                        <th>Score</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.slice().reverse().map((score) => (
                        <tr key={score.id}>
                          <td>{score.week}</td>
                          <td>{getTeamName(score.teamId)}</td>
                          <td>{score.courseName}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {score.nine === 'F' ? 'Front' : 'Back'}
                            </span>
                          </td>
                          <td><strong>{score.teamTotal || score.teamScore}</strong></td>
                          <td>{score.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Scorecard;
