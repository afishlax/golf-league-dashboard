const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

const server = app.listen(5000, () => {
  console.log('Test server running on http://localhost:5000');
});

// Keep process alive
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close();
  process.exit(0);
});
