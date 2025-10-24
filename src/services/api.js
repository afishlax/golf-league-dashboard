const API_BASE_URL = 'http://localhost:5000/api';

// ========== TEAMS API ==========

export const fetchTeams = async () => {
  const response = await fetch(`${API_BASE_URL}/teams`);
  if (!response.ok) throw new Error('Failed to fetch teams');
  return response.json();
};

export const fetchTeam = async (id) => {
  const response = await fetch(`${API_BASE_URL}/teams/${id}`);
  if (!response.ok) throw new Error('Failed to fetch team');
  return response.json();
};

export const createTeam = async (teamData) => {
  const response = await fetch(`${API_BASE_URL}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teamData),
  });
  if (!response.ok) throw new Error('Failed to create team');
  return response.json();
};

export const updateTeam = async (id, teamData) => {
  const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teamData),
  });
  if (!response.ok) throw new Error('Failed to update team');
  return response.json();
};

export const deleteTeam = async (id) => {
  const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete team');
  return response.json();
};

// ========== COURSES API ==========

export const fetchCourses = async () => {
  const response = await fetch(`${API_BASE_URL}/courses`);
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
};

// ========== SCORES API ==========

export const fetchScores = async () => {
  const response = await fetch(`${API_BASE_URL}/scores`);
  if (!response.ok) throw new Error('Failed to fetch scores');
  return response.json();
};

export const createScore = async (scoreData) => {
  const response = await fetch(`${API_BASE_URL}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scoreData),
  });
  if (!response.ok) throw new Error('Failed to create score');
  return response.json();
};

// ========== HANDICAPS API ==========

export const fetchHandicaps = async () => {
  const response = await fetch(`${API_BASE_URL}/handicaps`);
  if (!response.ok) throw new Error('Failed to fetch handicaps');
  return response.json();
};

export const createOrUpdateHandicap = async (handicapData) => {
  const response = await fetch(`${API_BASE_URL}/handicaps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(handicapData),
  });
  if (!response.ok) throw new Error('Failed to create/update handicap');
  return response.json();
};
