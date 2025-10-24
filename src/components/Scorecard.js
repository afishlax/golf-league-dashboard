import React, { useState } from 'react';
import { Card, Form, Button, Table, Row, Col, Alert } from 'react-bootstrap';

function Scorecard({ teams, courses, scores, schedule, onAddScore }) {
  // Initialize with first schedule item if available
  const getInitialScheduleKey = () => {
    if (schedule && schedule.length > 0) {
      const item = schedule[0];
      return `${item.week}|${item.courseName}|${item.nine}`;
    }
    return '';
  };

  const [formData, setFormData] = useState({
    teamId: teams.length > 0 ? teams[0].id : '',
    scheduleKey: getInitialScheduleKey(),
    date: new Date().toISOString().split('T')[0],
    teamScore: 36
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse the schedule key to extract week, course, and nine
    const [week, courseName, nine] = formData.scheduleKey.split('|');

    const newScore = {
      id: Date.now(),
      teamId: parseInt(formData.teamId),
      courseName: courseName,
      week: parseInt(week),
      date: formData.date,
      nine: nine,
      teamScore: parseInt(formData.teamScore)
    };

    onAddScore(newScore);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If schedule is changed, update date from schedule
    if (name === 'scheduleKey' && schedule && schedule.length > 0) {
      const [week] = value.split('|');
      const scheduleItem = schedule.find(s => s.week === parseInt(week));
      if (scheduleItem) {
        setFormData({
          ...formData,
          scheduleKey: value,
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

  // Format schedule options for dropdown
  const formatScheduleOption = (item) => {
    const nineText = item.nine === 'F' ? 'Front' : 'Back';
    return `Week ${item.week} - ${item.courseName} (${nineText})`;
  };

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
                      <Form.Label>Date Played</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                      <Form.Text className="text-muted">
                        Auto-filled from schedule
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Week & Course</Form.Label>
                      <Form.Select
                        name="scheduleKey"
                        value={formData.scheduleKey}
                        onChange={handleChange}
                        required
                      >
                        {schedule && schedule.map(item => {
                          const key = `${item.week}|${item.courseName}|${item.nine}`;
                          return (
                            <option key={key} value={key}>
                              {formatScheduleOption(item)}
                            </option>
                          );
                        })}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Select the week, course, and nine combination
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Team Score (2-Man Scramble)</Form.Label>
                      <Form.Control
                        type="number"
                        name="teamScore"
                        value={formData.teamScore}
                        onChange={handleChange}
                        min="25"
                        max="100"
                        required
                        style={{ fontWeight: 'bold', fontSize: '1.2em' }}
                      />
                      <Form.Text className="text-muted">
                        Enter the combined team score for 9 holes
                      </Form.Text>
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
                          <td><strong>{score.teamScore}</strong></td>
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
