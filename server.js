const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve dashboard.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Serve live worklight.json
app.get('/worklight.json', (req, res) => {
  fs.readFile('./worklight.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error reading worklight.json');
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
