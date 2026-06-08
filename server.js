const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const LOG_FILE = path.join(__dirname, 'chat_logs.json');

function loadLogs() {
  if (!fs.existsSync(LOG_FILE)) return [];
  return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
}

function saveLogs(logs) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

app.post('/api/chat', (req, res) => {
  const { role, content, timestamp, deviceInfo } = req.body;
  const logs = loadLogs();
  logs.push({ role, content, timestamp, deviceInfo, receivedAt: new Date().toISOString() });
  saveLogs(logs);
  res.json({ status: 'ok' });
});

app.get('/api/chat', (req, res) => {
  const logs = loadLogs();
  logs.reverse();
  res.json(logs);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));