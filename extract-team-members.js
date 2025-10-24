const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('/Users/austinfisher/Downloads/Golf League 2026.xlsx');
const rulesSheet = workbook.Sheets['League Dues and Rules '];
const data = XLSX.utils.sheet_to_json(rulesSheet, { header: 1, defval: '' });

console.log('Team Payment Data (Rows 7-30):');

const teamData = [];
data.slice(6, 30).forEach((row, idx) => {
  if (row[0] && row[0].trim() !== '') {
    const teamInfo = {
      teamName: row[0].trim(),
      paymentInfo: row[1] ? row[1].trim() : 'Not Paid'
    };
    console.log(`Row ${idx + 7}:`, teamInfo);
    teamData.push(teamInfo);
  }
});

console.log('\n\nAll Team Data:');
console.log(JSON.stringify(teamData, null, 2));
