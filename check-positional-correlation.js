const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('/Users/austinfisher/Downloads/Golf League 2026.xlsx');

// Get team names from standings
const standingsSheet = workbook.Sheets['Current Standings '];
const standingsData = XLSX.utils.sheet_to_json(standingsSheet, { header: 1 });
const teamNamesFromStandings = standingsData[2].slice(1).filter(name => name && name !== 'xx').map(n => n.trim());

// Get team member info from dues sheet
const rulesSheet = workbook.Sheets['League Dues and Rules '];
const rulesData = XLSX.utils.sheet_to_json(rulesSheet, { header: 1, defval: '' });

const teamMemberData = [];
rulesData.slice(6, 30).forEach((row) => {
  if (row[0] && row[0].trim() !== '') {
    teamMemberData.push({
      fullName: row[0].trim(),
      paymentInfo: row[1] ? row[1].trim() : 'Not Paid'
    });
  }
});

console.log('=== POSITIONAL 1-TO-1 CORRELATION ===');
console.log(`Teams in Standings: ${teamNamesFromStandings.length}`);
console.log(`Entries in Dues: ${teamMemberData.length}\n`);

console.log('Position | Standings Team Name              | Dues Sheet Player Names\n');
console.log('-'.repeat(100));

const maxLength = Math.max(teamNamesFromStandings.length, teamMemberData.length);

for (let i = 0; i < maxLength; i++) {
  const standingTeam = teamNamesFromStandings[i] || '(none)';
  const duesTeam = teamMemberData[i] ? teamMemberData[i].fullName : '(none)';
  const payment = teamMemberData[i] ? teamMemberData[i].paymentInfo : '';

  console.log(`${(i + 1).toString().padStart(2)}       | ${standingTeam.padEnd(32)} | ${duesTeam}`);
  if (payment && payment !== 'Not Paid') {
    console.log(`         |                                  |   Payment: ${payment}`);
  }
}

console.log('\n\n=== SUGGESTED CORRELATION (First 16 entries) ===\n');
for (let i = 0; i < 16; i++) {
  if (teamMemberData[i]) {
    const playerNames = teamMemberData[i].fullName.split('(')[0].trim();
    console.log(`"${teamNamesFromStandings[i]}" -> "${playerNames}" (${teamMemberData[i].paymentInfo})`);
  }
}
