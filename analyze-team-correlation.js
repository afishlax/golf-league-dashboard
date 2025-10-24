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

console.log('=== TEAM NAMES FROM CURRENT STANDINGS ===');
console.log('(These are the "official" team names)\n');
teamNamesFromStandings.forEach((name, i) => {
  console.log(`${i + 1}. "${name}"`);
});

console.log('\n\n=== PLAYER PAIRINGS FROM LEAGUE DUES AND RULES ===');
console.log('(Looking for names with & between them)\n');
teamMemberData.forEach((tm, i) => {
  const hasAmpersand = tm.fullName.includes('&');
  console.log(`${i + 1}. "${tm.fullName}" ${hasAmpersand ? '✓' : '✗'} - ${tm.paymentInfo}`);
});

console.log('\n\n=== ATTEMPTING 1-TO-1 CORRELATION ===');
console.log('Standings Name -> Player Names from Dues Sheet\n');

// Try to correlate them 1-to-1
teamNamesFromStandings.forEach((standingName, index) => {
  console.log(`\n${index + 1}. "${standingName}"`);

  // Find potential matches
  const potentialMatches = teamMemberData.filter(tm => {
    const fullName = tm.fullName.toLowerCase();
    const standing = standingName.toLowerCase();

    // Check if standing name appears in full name
    if (fullName.includes(standing)) return true;

    // Check if standing name appears in parentheses
    const inParens = fullName.match(/\((.*?)\)/);
    if (inParens && inParens[1].toLowerCase().includes(standing)) return true;

    return false;
  });

  if (potentialMatches.length > 0) {
    potentialMatches.forEach(match => {
      console.log(`   -> MATCH: "${match.fullName}"`);
    });
  } else {
    console.log(`   -> NO MATCH FOUND`);
  }
});
