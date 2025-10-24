const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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

// ========== SCHEDULE API ==========

export const fetchSchedule = async () => {
  const response = await fetch(`${API_BASE_URL}/schedule`);
  if (!response.ok) throw new Error('Failed to fetch schedule');
  return response.json();
};

export const updateScheduleWeek = async (week, scheduleData) => {
  const response = await fetch(`${API_BASE_URL}/schedule/${week}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scheduleData),
  });
  if (!response.ok) throw new Error('Failed to update schedule');
  return response.json();
};

// ========== TEE TIMES API ==========

export const fetchTeeTimes = async () => {
  const response = await fetch(`${API_BASE_URL}/teetimes`);
  if (!response.ok) throw new Error('Failed to fetch tee times');
  return response.json();
};

export const fetchTeeTimesByWeek = async (week) => {
  const response = await fetch(`${API_BASE_URL}/teetimes/week/${week}`);
  if (!response.ok) throw new Error('Failed to fetch tee times');
  return response.json();
};

export const createTeeTime = async (teeTimeData) => {
  const response = await fetch(`${API_BASE_URL}/teetimes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teeTimeData),
  });
  if (!response.ok) throw new Error('Failed to create tee time');
  return response.json();
};

export const deleteTeeTime = async (id) => {
  const response = await fetch(`${API_BASE_URL}/teetimes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete tee time');
  return response.json();
};

// ========== SCORES UPDATE/DELETE API ==========

export const updateScore = async (id, scoreData) => {
  const response = await fetch(`${API_BASE_URL}/scores/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scoreData),
  });
  if (!response.ok) throw new Error('Failed to update score');
  return response.json();
};

export const deleteScore = async (id) => {
  const response = await fetch(`${API_BASE_URL}/scores/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete score');
  return response.json();
};

// ========== COURSES UPDATE API ==========

export const updateCourse = async (name, courseData) => {
  const response = await fetch(`${API_BASE_URL}/courses/${encodeURIComponent(name)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData),
  });
  if (!response.ok) throw new Error('Failed to update course');
  return response.json();
};
