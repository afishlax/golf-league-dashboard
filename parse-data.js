const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('/Users/austinfisher/Downloads/Golf League 2026.xlsx');

// Extract team names from Current Standings sheet
const standingsSheet = workbook.Sheets['Current Standings '];
const standingsData = XLSX.utils.sheet_to_json(standingsSheet, { header: 1 });

// Row 2 contains team names (index 2) - only get first 16 named teams
const teamNames = standingsData[2].slice(1).filter(name => name && name !== 'xx');

// Extract team members and payment info from League Dues and Rules sheet
const rulesSheet = workbook.Sheets['League Dues and Rules '];
const rulesData = XLSX.utils.sheet_to_json(rulesSheet, { header: 1, defval: '' });

// Get ALL team member data from rows 7-30 (21 teams total, some without team names yet)
const teamMemberData = [];
rulesData.slice(6, 30).forEach((row) => {
  if (row[0] && row[0].trim() !== '' && !row[0].includes('OPEN')) {
    teamMemberData.push({
      fullName: row[0].trim(),
      paymentInfo: row[1] ? row[1].trim() : 'Not Paid'
    });
  }
});

// Create teams array using positional 1-to-1 correlation
// First 16 have team names, rest will have blank team names
const teams = teamMemberData.map((memberInfo, index) => {
  // Extract player names from the full name
  const fullName = memberInfo.fullName;
  let player1 = '';
  let player2 = '';

  // Handle different formats like "Mason & Rich (Ham & Turkey)" or "Dave & Stronz"
  const withoutParens = fullName.split('(')[0].trim();
  const players = withoutParens.split(/[&\/+]/).map(p => p.trim());

  player1 = players[0] || `Player ${index + 1}A`;
  player2 = players[1] || `Player ${index + 1}B`;

  // First 16 teams have names from standings, rest are blank
  const teamName = index < teamNames.length ? teamNames[index].trim() : '';

  return {
    id: index + 1,
    name: teamName,
    player1: player1,
    player2: player2,
    paymentStatus: memberInfo.paymentInfo
  };
});

console.log('TEAMS:');
console.log(JSON.stringify(teams, null, 2));

// Extract courses from Course List sheet
const courseSheet = workbook.Sheets['Course List '];
const courseData = XLSX.utils.sheet_to_json(courseSheet, { header: 1 });

const courses = courseData
  .filter(row => row[0] && row[0].includes('Week'))
  .map(row => ({
    name: row[1] ? row[1].trim() : '',
    par: 36, // 9 holes
    slope: 135,
    rating: 35.0
  }))
  .filter(course => course.name);

console.log('\nCOURSES:');
console.log(JSON.stringify(courses, null, 2));

// Create output file
const output = {
  teams,
  courses,
  handicaps: [],
  scores: []
};

fs.writeFileSync('golf-league-data.json', JSON.stringify(output, null, 2));
console.log('\n✅ Data exported to golf-league-data.json');
