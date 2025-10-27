import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Tab, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import * as api from './services/api';

import Teams from './components/Teams';
import Scorecard from './components/Scorecard';
import Courses from './components/Courses';
import Leaderboard from './components/Leaderboard';
import RoundHistory from './components/RoundHistory';
import TeeTimeSchedule from './components/TeeTimeSchedule';
import MySchedule from './components/MySchedule';
import Rules from './components/Rules';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';

function App() {
  const [teams, setTeams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [scores, setScores] = useState([]);
  const [handicaps, setHandicaps] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from API on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [teamsData, coursesData, scoresData, handicapsData, scheduleData] = await Promise.all([
        api.fetchTeams(),
        api.fetchCourses(),
        api.fetchScores(),
        api.fetchHandicaps(),
        api.fetchSchedule(),
      ]);

      setTeams(teamsData);
      setCourses(coursesData);
      setScores(scoresData);
      setHandicaps(handicapsData);
      setSchedule(scheduleData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data from server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const addScore = async (newScore) => {
    try {
      await api.createScore(newScore);
      // Reload scores after adding
      const scoresData = await api.fetchScores();
      setScores(scoresData);
    } catch (err) {
      console.error('Error adding score:', err);
      alert('Failed to add score');
    }
  };

  if (loading) {
    return (
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="#home">🏌️ Winter Golf League Dashboard</Navbar.Brand>
          </Container>
        </Navbar>
        <Container className="mt-5 text-center">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-3">Loading golf league data...</p>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="#home">🏌️ Winter Golf League Dashboard</Navbar.Brand>
          </Container>
        </Navbar>
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>Error Loading Data</Alert.Heading>
            <p>{error}</p>
            <hr />
            <p className="mb-0">
              Make sure the backend server is running: <code>npm run server</code>
            </p>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">🏌️ Winter Golf League Dashboard</Navbar.Brand>
        </Container>
      </Navbar>

      <Container fluid className="mt-3">
        <Tab.Container defaultActiveKey="teams">
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="teams">Teams</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="schedule">Book Tee Time</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="myschedule">My Schedule</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="scorecard">Scorecard</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="courses">Courses & Handicaps</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="leaderboard">Leaderboard</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="roundhistory">Round History</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="rules">Rules</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="admin">Admin</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="teams">
              <Teams teams={teams} />
            </Tab.Pane>
            <Tab.Pane eventKey="schedule">
              <TeeTimeSchedule teams={teams} schedule={schedule} />
            </Tab.Pane>
            <Tab.Pane eventKey="myschedule">
              <MySchedule teams={teams} schedule={schedule} scores={scores} />
            </Tab.Pane>
            <Tab.Pane eventKey="scorecard">
              <Scorecard
                teams={teams}
                courses={courses}
                scores={scores}
                schedule={schedule}
                onAddScore={addScore}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="courses">
              <Courses courses={courses} handicaps={handicaps} />
            </Tab.Pane>
            <Tab.Pane eventKey="leaderboard">
              <Leaderboard teams={teams} scores={scores} />
            </Tab.Pane>
            <Tab.Pane eventKey="roundhistory">
              <RoundHistory teams={teams} scores={scores} schedule={schedule} />
            </Tab.Pane>
            <Tab.Pane eventKey="rules">
              <Rules />
            </Tab.Pane>
            <Tab.Pane eventKey="admin">
              {isAdminAuthenticated ? (
                <AdminPanel
                  teams={teams}
                  setTeams={setTeams}
                  courses={courses}
                  setCourses={setCourses}
                  scores={scores}
                  setScores={setScores}
                  schedule={schedule}
                  setSchedule={setSchedule}
                  onLogout={() => setIsAdminAuthenticated(false)}
                />
              ) : (
                <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
}

export default App;
