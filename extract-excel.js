const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('/Users/austinfisher/Downloads/Golf League 2026.xlsx');

console.log('Sheet Names:', workbook.SheetNames);
console.log('\n');

// Extract data from each sheet
workbook.SheetNames.forEach(sheetName => {
  console.log(`\n========== ${sheetName} ==========`);
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  console.log('Data:');
  data.slice(0, 20).forEach((row, idx) => {
    console.log(`Row ${idx}:`, row);
  });

  console.log(`\nTotal rows: ${data.length}`);
  console.log('\n');
});

// Try to extract as JSON
console.log('\n========== JSON EXTRACTION ==========\n');

workbook.SheetNames.forEach(sheetName => {
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  console.log(`\n${sheetName} (JSON):`);
  console.log(JSON.stringify(jsonData.slice(0, 5), null, 2));
});
