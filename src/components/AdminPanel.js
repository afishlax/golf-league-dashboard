import React, { useState, useEffect } from 'react';
import { Card, Tab, Tabs, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import * as api from '../services/api';

function AdminPanel({ teams, setTeams, courses, setCourses, scores, setScores, schedule, setSchedule, onLogout }) {
  const [activeTab, setActiveTab] = useState('teams');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'team', 'score', 'course', 'schedule'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [teeTimes, setTeeTimes] = useState([]);
  const [message, setMessage] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ========== TEAM MANAGEMENT ==========

  const handleEditTeam = (team) => {
    setModalType('team');
    setEditingItem(team);
    setFormData({ ...team });
    setShowModal(true);
  };

  const handleAddTeam = () => {
    const newId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;
    setModalType('team');
    setEditingItem({ id: newId });
    setFormData({
      name: '',
      player1: '',
      player2: '',
      player1Payment: 'Not Paid',
      player2Payment: 'Not Paid'
    });
    setShowModal(true);
  };

  const handleSaveTeam = async () => {
    try {
      setSaving(true);
      if (teams.find(t => t.id === editingItem.id)) {
        await api.updateTeam(editingItem.id, formData);
      } else {
        await api.createTeam(formData);
      }
      const updatedTeams = await api.fetchTeams();
      setTeams(updatedTeams);
      setShowModal(false);
      showMessage('Team saved successfully');
    } catch (err) {
      console.error('Error saving team:', err);
      alert('Failed to save team');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await api.deleteTeam(teamId);
        const updatedTeams = await api.fetchTeams();
        setTeams(updatedTeams);
        showMessage('Team deleted successfully');
      } catch (err) {
        console.error('Error deleting team:', err);
        alert('Failed to delete team');
      }
    }
  };

  // ========== SCORE MANAGEMENT ==========

  const handleEditScore = (score) => {
    setModalType('score');
    setEditingItem(score);
    setFormData({ ...score });
    setShowModal(true);
  };

  const handleSaveScore = async () => {
    try {
      setSaving(true);
      await api.updateScore(editingItem.id, formData);
      const updatedScores = await api.fetchScores();
      setScores(updatedScores);
      setShowModal(false);
      showMessage('Score updated successfully');
    } catch (err) {
      console.error('Error saving score:', err);
      alert('Failed to save score');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteScore = async (scoreId) => {
    if (window.confirm('Are you sure you want to delete this score?')) {
      try {
        await api.deleteScore(scoreId);
        const updatedScores = await api.fetchScores();
        setScores(updatedScores);
        showMessage('Score deleted successfully');
      } catch (err) {
        console.error('Error deleting score:', err);
        alert('Failed to delete score');
      }
    }
  };

  // ========== COURSE MANAGEMENT ==========

  const handleEditCourse = (course) => {
    setModalType('course');
    setEditingItem(course);
    setFormData({ ...course });
    setShowModal(true);
  };

  const handleSaveCourse = async () => {
    try {
      setSaving(true);
      await api.updateCourse(editingItem.name, formData);
      const updatedCourses = await api.fetchCourses();
      setCourses(updatedCourses);
      setShowModal(false);
      showMessage('Course updated successfully');
    } catch (err) {
      console.error('Error saving course:', err);
      alert('Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  // ========== SCHEDULE MANAGEMENT ==========

  const handleEditScheduleWeek = (scheduleWeek) => {
    setModalType('schedule');
    setEditingItem(scheduleWeek);
    setFormData({ ...scheduleWeek });
    setShowModal(true);
  };

  const handleSaveScheduleWeek = async () => {
    try {
      setSaving(true);
      await api.updateScheduleWeek(editingItem.week, formData);
      const updatedSchedule = await api.fetchSchedule();
      setSchedule(updatedSchedule);
      setShowModal(false);
      showMessage('Schedule week updated successfully');
    } catch (err) {
      console.error('Error saving schedule:', err);
      alert('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  // ========== TEE TIME MANAGEMENT ==========

  const handleDeleteTeeTime = async (teeTimeId) => {
    if (window.confirm('Are you sure you want to delete this tee time booking?')) {
      try {
        await api.deleteTeeTime(teeTimeId);
        loadTeeTimes();
        showMessage('Tee time deleted successfully');
      } catch (err) {
        console.error('Error deleting tee time:', err);
        alert('Failed to delete tee time');
      }
    }
  };

  // ========== HELPERS ==========

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Unknown';
  };

  const renderSaveButton = () => {
    const handlers = {
      team: handleSaveTeam,
      score: handleSaveScore,
      course: handleSaveCourse,
      schedule: handleSaveScheduleWeek
    };
    return (
      <Button variant="primary" onClick={handlers[modalType]} disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    );
  };

  return (
    <div>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Admin Panel</h5>
          <Button variant="danger" size="sm" onClick={onLogout}>
            Logout
          </Button>
        </Card.Header>
        <Card.Body>
          {message && <Alert variant="success">{message}</Alert>}

          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            {/* TEAMS TAB */}
            <Tab eventKey="teams" title="Teams">
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
                      <td>{team.name || <em className="text-muted">(No name)</em>}</td>
                      <td>{team.player1}</td>
                      <td><small>{team.player1Payment}</small></td>
                      <td>{team.player2}</td>
                      <td><small>{team.player2Payment}</small></td>
                      <td>
                        <Button variant="primary" size="sm" className="me-2" onClick={() => handleEditTeam(team)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteTeam(team.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            {/* SCORES TAB */}
            <Tab eventKey="scores" title="Scores">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Week</th>
                    <th>Team</th>
                    <th>Course</th>
                    <th>Nine</th>
                    <th>P1 Score</th>
                    <th>P2 Score</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score) => (
                    <tr key={score.id}>
                      <td>{score.id}</td>
                      <td>{score.week}</td>
                      <td>{getTeamName(score.teamId)}</td>
                      <td><small>{score.courseName}</small></td>
                      <td>{score.nine}</td>
                      <td>{score.player1Score}</td>
                      <td>{score.player2Score}</td>
                      <td><strong>{score.teamTotal}</strong></td>
                      <td>{score.date}</td>
                      <td>
                        <Button variant="primary" size="sm" className="me-2" onClick={() => handleEditScore(score)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteScore(score.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            {/* COURSES TAB */}
            <Tab eventKey="courses" title="Courses">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Par</th>
                    <th>Slope</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.name}>
                      <td>{course.name}</td>
                      <td>{course.par}</td>
                      <td>{course.slope}</td>
                      <td>{course.rating}</td>
                      <td>
                        <Button variant="primary" size="sm" onClick={() => handleEditCourse(course)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            {/* SCHEDULE TAB */}
            <Tab eventKey="schedule" title="Schedule">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Week</th>
                    <th>Date</th>
                    <th>Course</th>
                    <th>Nine</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((week) => (
                    <tr key={week.week}>
                      <td>{week.week}</td>
                      <td>{week.date}</td>
                      <td>{week.courseName}</td>
                      <td>{week.nine === 'F' ? 'Front' : 'Back'}</td>
                      <td>
                        <Button variant="primary" size="sm" onClick={() => handleEditScheduleWeek(week)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            {/* TEE TIMES TAB */}
            <Tab eventKey="teetimes" title="Tee Times">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Week</th>
                    <th>Team</th>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teeTimes.map((teeTime) => (
                    <tr key={teeTime.id}>
                      <td>{teeTime.id}</td>
                      <td>{teeTime.week}</td>
                      <td>{getTeamName(teeTime.teamId)}</td>
                      <td>{teeTime.day}</td>
                      <td>{teeTime.time}</td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteTeeTime(teeTime.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* EDIT MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'team' && (teams.find(t => t.id === editingItem?.id) ? 'Edit Team' : 'Add New Team')}
            {modalType === 'score' && 'Edit Score'}
            {modalType === 'course' && 'Edit Course'}
            {modalType === 'schedule' && 'Edit Schedule Week'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* TEAM FORM */}
            {modalType === 'team' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Team Name</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Player 1 Name</Form.Label>
                  <Form.Control type="text" name="player1" value={formData.player1 || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Player 2 Name</Form.Label>
                  <Form.Control type="text" name="player2" value={formData.player2 || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Player 1 Payment</Form.Label>
                  <Form.Control type="text" name="player1Payment" value={formData.player1Payment || 'Not Paid'} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Player 2 Payment</Form.Label>
                  <Form.Control type="text" name="player2Payment" value={formData.player2Payment || 'Not Paid'} onChange={handleChange} />
                </Form.Group>
              </>
            )}

            {/* SCORE FORM */}
            {modalType === 'score' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Team</Form.Label>
                  <Form.Select name="teamId" value={formData.teamId || ''} onChange={handleChange}>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Week</Form.Label>
                  <Form.Control type="number" name="week" value={formData.week || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Course Name</Form.Label>
                  <Form.Control type="text" name="courseName" value={formData.courseName || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nine</Form.Label>
                  <Form.Select name="nine" value={formData.nine || 'F'} onChange={handleChange}>
                    <option value="F">Front</option>
                    <option value="B">Back</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Player 1 Score</Form.Label>
                  <Form.Control type="number" name="player1Score" value={formData.player1Score || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Player 2 Score</Form.Label>
                  <Form.Control type="number" name="player2Score" value={formData.player2Score || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Team Total</Form.Label>
                  <Form.Control
                    type="number"
                    name="teamTotal"
                    value={formData.teamTotal || (Number(formData.player1Score || 0) + Number(formData.player2Score || 0))}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" name="date" value={formData.date || ''} onChange={handleChange} />
                </Form.Group>
              </>
            )}

            {/* COURSE FORM */}
            {modalType === 'course' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Course Name</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Par</Form.Label>
                  <Form.Control type="number" name="par" value={formData.par || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Slope</Form.Label>
                  <Form.Control type="number" name="slope" value={formData.slope || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control type="number" step="0.1" name="rating" value={formData.rating || ''} onChange={handleChange} />
                </Form.Group>
              </>
            )}

            {/* SCHEDULE FORM */}
            {modalType === 'schedule' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Week</Form.Label>
                  <Form.Control type="number" value={formData.week || ''} readOnly />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="text" name="date" value={formData.date || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Course Name</Form.Label>
                  <Form.Select name="courseName" value={formData.courseName || ''} onChange={handleChange}>
                    {courses.map(course => (
                      <option key={course.name} value={course.name}>{course.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nine</Form.Label>
                  <Form.Select name="nine" value={formData.nine || 'F'} onChange={handleChange}>
                    <option value="F">Front</option>
                    <option value="B">Back</option>
                  </Form.Select>
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>
            Cancel
          </Button>
          {renderSaveButton()}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminPanel;
