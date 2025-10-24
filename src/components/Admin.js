import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import * as api from '../services/api';

function Admin({ teams, setTeams, onLogout }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const handleEdit = (team) => {
    setEditingTeam(team);
    setFormData({ ...team });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (teams.find(t => t.id === editingTeam.id)) {
        // Update existing team
        await api.updateTeam(editingTeam.id, formData);
      } else {
        // Create new team
        await api.createTeam(formData);
      }

      // Reload teams from server
      const updatedTeams = await api.fetchTeams();
      setTeams(updatedTeams);

      setShowEditModal(false);
      setEditingTeam(null);
    } catch (err) {
      console.error('Error saving team:', err);
      alert('Failed to save team');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await api.deleteTeam(teamId);
        // Reload teams from server
        const updatedTeams = await api.fetchTeams();
        setTeams(updatedTeams);
      } catch (err) {
        console.error('Error deleting team:', err);
        alert('Failed to delete team');
      }
    }
  };

  const handleAddTeam = () => {
    const newId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;
    const newTeam = {
      name: '',
      player1: '',
      player2: '',
      player1Payment: 'Not Paid',
      player2Payment: 'Not Paid'
    };
    setEditingTeam({ id: newId });
    setFormData(newTeam);
    setShowEditModal(true);
  };

  return (
    <div>
      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Admin Panel - Team Management</h5>
          <Button variant="danger" size="sm" onClick={onLogout}>
            Logout
          </Button>
        </Card.Header>
        <Card.Body>
          <Alert variant="warning">
            <strong>Admin Mode:</strong> You can edit team information, player names, and individual player payments here. Changes are saved to the server.
          </Alert>

          <Button variant="success" className="mb-3" onClick={handleAddTeam}>
            + Add New Team
          </Button>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Team Name</th>
                <th>Player 1</th>
                <th>Player 1 Payment</th>
                <th>Player 2</th>
                <th>Player 2 Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td>{team.id}</td>
                  <td>{team.name || <em className="text-muted">(No team name)</em>}</td>
                  <td>{team.player1}</td>
                  <td>
                    {team.player1Payment === 'Not Paid' ? (
                      <span className="badge bg-danger">Not Paid</span>
                    ) : (
                      <span className="badge bg-success">Paid</span>
                    )}
                    <br />
                    <small className="text-muted">{team.player1Payment}</small>
                  </td>
                  <td>{team.player2}</td>
                  <td>
                    {team.player2Payment === 'Not Paid' ? (
                      <span className="badge bg-danger">Not Paid</span>
                    ) : (
                      <span className="badge bg-success">Paid</span>
                    )}
                    <br />
                    <small className="text-muted">{team.player2Payment}</small>
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(team)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(team.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTeam && teams.find(t => t.id === editingTeam.id) ? 'Edit Team' : 'Add New Team'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Team Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Enter team name"
              />
              <Form.Text className="text-muted">
                Leave blank if team doesn't have a name yet
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Player 1 Name</Form.Label>
              <Form.Control
                type="text"
                name="player1"
                value={formData.player1 || ''}
                onChange={handleChange}
                placeholder="Enter player 1 name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Player 2 Name</Form.Label>
              <Form.Control
                type="text"
                name="player2"
                value={formData.player2 || ''}
                onChange={handleChange}
                placeholder="Enter player 2 name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Player 1 Payment</Form.Label>
              <Form.Control
                type="text"
                name="player1Payment"
                value={formData.player1Payment || 'Not Paid'}
                onChange={handleChange}
                placeholder="e.g., Cash 10/20, Venmo 10/15, Not Paid"
              />
              <Form.Text className="text-muted">
                Enter payment method and date, or "Not Paid"
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Player 2 Payment</Form.Label>
              <Form.Control
                type="text"
                name="player2Payment"
                value={formData.player2Payment || 'Not Paid'}
                onChange={handleChange}
                placeholder="e.g., Cash 10/20, Venmo 10/15, Not Paid"
              />
              <Form.Text className="text-muted">
                Enter payment method and date, or "Not Paid"
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Admin;
