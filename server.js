/**
 * Express Server for Work Light Lite Dashboard
 * Serves the dashboard and provides API endpoints
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { config } = require('./src/config');
const { getActiveEntries } = require('./src/dataManager');

const app = express();
const PORT = config.server.port;

// Serve static files from docs directory
app.use(express.static('docs'));

// Serve dashboard at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// API endpoint to get active worklight entries
app.get('/api/worklight', (req, res) => {
  try {
    const entries = getActiveEntries();
    res.json(entries);
  } catch (error) {
    console.error('Error fetching worklight data:', error);
    res.status(500).json({ error: 'Failed to fetch worklight data' });
  }
});

// Legacy endpoint for backward compatibility
app.get('/worklight.json', (req, res) => {
  fs.readFile(config.data.worklightFile, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading worklight.json:', err);
      return res.status(500).json({ error: 'Error reading worklight.json' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`✅ Express server running on port ${PORT}`);
  console.log(`   Dashboard: http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/worklight`);
});
