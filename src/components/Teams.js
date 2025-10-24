import React from 'react';
import { Card, Table, Row, Col, Badge } from 'react-bootstrap';

function Teams({ teams }) {
  const getPaymentBadge = (payment) => {
    if (!payment || payment === 'Not Paid') {
      return <Badge bg="danger">Not Paid</Badge>;
    }
    return <Badge bg="success">Paid</Badge>;
  };

  const teamsPaid = teams.filter(t =>
    (t.player1Payment && t.player1Payment !== 'Not Paid') &&
    (t.player2Payment && t.player2Payment !== 'Not Paid')
  ).length;
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
                  <th>Player 1 Payment</th>
                  <th>Player 2</th>
                  <th>Player 2 Payment</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td>{team.id}</td>
                    <td><strong>{team.name}</strong></td>
                    <td>{team.player1}</td>
                    <td>
                      {getPaymentBadge(team.player1Payment)}
                      {team.player1Payment && team.player1Payment !== 'Not Paid' && (
                        <><br /><small className="text-muted">{team.player1Payment}</small></>
                      )}
                    </td>
                    <td>{team.player2}</td>
                    <td>
                      {getPaymentBadge(team.player2Payment)}
                      {team.player2Payment && team.player2Payment !== 'Not Paid' && (
                        <><br /><small className="text-muted">{team.player2Payment}</small></>
                      )}
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
