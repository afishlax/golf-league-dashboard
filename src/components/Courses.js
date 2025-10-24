import React from 'react';
import { Card, Table, Row, Col } from 'react-bootstrap';

function Courses({ courses, handicaps }) {
  const calculateCourseHandicap = (handicapIndex, slope, rating, par) => {
    return Math.round((handicapIndex * slope / 113) + (rating - par));
  };

  return (
    <div>
      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header as="h5">Available Courses</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Par</th>
                    <th>Slope</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, idx) => (
                    <tr key={idx}>
                      <td><strong>{course.name}</strong></td>
                      <td>{course.par}</td>
                      <td>{course.slope}</td>
                      <td>{course.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Header as="h5">Player Handicap Indexes</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>Player Name</th>
                    <th>Handicap Index</th>
                  </tr>
                </thead>
                <tbody>
                  {handicaps
                    .sort((a, b) => a.handicapIndex - b.handicapIndex)
                    .map((h, idx) => (
                      <tr key={idx}>
                        <td>{h.playerName}</td>
                        <td>{h.handicapIndex}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-3">
            <Card.Header as="h5">Course Handicap Calculator</Card.Header>
            <Card.Body>
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>Course</th>
                      <th>Index</th>
                      <th>Course Handicap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {handicaps.map((player) =>
                      courses.map((course) => {
                        const courseHandicap = calculateCourseHandicap(
                          player.handicapIndex,
                          course.slope,
                          course.rating,
                          course.par
                        );
                        return (
                          <tr key={`${player.playerName}-${course.name}`}>
                            <td>{player.playerName}</td>
                            <td>{course.name}</td>
                            <td>{player.handicapIndex}</td>
                            <td><strong>{courseHandicap}</strong></td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          <Card bg="light">
            <Card.Body>
              <h6>USGA Handicap Formula:</h6>
              <code>
                Course Handicap = (Handicap Index × Slope / 113) + (Rating - Par)
              </code>
              <p className="mt-2 mb-0 small text-muted">
                The course handicap adjusts a player's handicap index for the specific difficulty of the course being played.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Courses;
