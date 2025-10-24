import React from 'react';
import { Card, Table, Row, Col, Badge } from 'react-bootstrap';

function Teams({ teams }) {
  const getPaymentBadge = (paymentStatus) => {
    if (!paymentStatus || paymentStatus === 'Not Paid') {
      return <Badge bg="danger">Not Paid</Badge>;
    }
    return <Badge bg="success">Paid</Badge>;
  };

  const teamsPaid = teams.filter(t => t.paymentStatus && t.paymentStatus !== 'Not Paid').length;
  const teamsUnpaid = teams.length - teamsPaid;

  return (
    <Row>
      <Col>
        <Card className="mb-3">
          <Card.Header as="h5">Team Rosters & Payment Status</Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Team ID</th>
                  <th>Team Name</th>
                  <th>Player 1</th>
                  <th>Player 2</th>
                  <th>Payment Status</th>
                  <th>Payment Details</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td>{team.id}</td>
                    <td><strong>{team.name}</strong></td>
                    <td>{team.player1}</td>
                    <td>{team.player2}</td>
                    <td>{getPaymentBadge(team.paymentStatus)}</td>
                    <td className="text-muted">
                      <small>{team.paymentStatus === 'Not Paid' ? '-' : team.paymentStatus}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Row>
          <Col md={4}>
            <Card bg="info" text="white" className="mb-3">
              <Card.Body>
                <h6>Total Teams</h6>
                <h3 className="mb-0">{teams.length}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card bg="success" text="white" className="mb-3">
              <Card.Body>
                <h6>Teams Paid</h6>
                <h3 className="mb-0">{teamsPaid}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card bg="danger" text="white" className="mb-3">
              <Card.Body>
                <h6>Teams Unpaid</h6>
                <h3 className="mb-0">{teamsUnpaid}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Teams;
