const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('/Users/austinfisher/Downloads/Golf League 2026.xlsx');

// Get team names from standings
const standingsSheet = workbook.Sheets['Current Standings '];
const standingsData = XLSX.utils.sheet_to_json(standingsSheet, { header: 1 });
const teamNames = standingsData[2].slice(1).filter(name => name && name !== 'xx').map(n => n.trim());

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

console.log('Team Names from Standings:');
teamNames.forEach((name, i) => console.log(`${i}: "${name}"`));

console.log('\n\nTeam Member Data from Dues Sheet:');
teamMemberData.forEach((tm, i) => console.log(`${i}: "${tm.fullName}" - ${tm.paymentInfo}`));

// Create mapping
console.log('\n\nMAPPING:');
const teamMapping = {
  'Ham & Turkey': 'Mason & Rich (Ham & Turkey)',
  'Dave / Stronz': 'Dave & Stronz',
  'Pallbearers': 'Scott & Austin (Pallbearers)',
  'Two Boys and a Ball': 'Aaron & Jake',
  'Ya YA Boys': 'Willie & Todd',
  'Big Daddy Hacks': 'Mike T & Frank',
  'In the Putt': 'Halter & Keys',
  'Brian / Ben': 'Brian & Ben',
  'Weapons of Grass Destruction': 'Bryan & Graybar Co',
  'Slice Girls': 'Traci & Katie',
  'Dude Wheres My Par': 'Zach & Justin',
  'Bogey Boys': 'Tyler & Matt Mitchell',
  'Frank & Beans': 'Minning & Ray',
  'Blake / Lee': 'Blake & Lee',
  'Lost Balls': 'Votaw + Sarah',
  'Bunker Babes': 'Oberkiser & Jamie'
};

console.log(JSON.stringify(teamMapping, null, 2));
