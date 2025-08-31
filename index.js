const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// -------------------- ROUTES --------------------

// AQI route
app.get('/api/aqi', (req, res) => {
  const data = {
    aqi: Math.floor(Math.random() * 201), // random AQI 0-200
    pm25: (Math.random() * 150).toFixed(1),
    pm10: (Math.random() * 200).toFixed(1),
    no2: (Math.random() * 100).toFixed(1),
    o3: (Math.random() * 120).toFixed(1)
  };
  res.json(data);
});

// Water quality route
app.get('/api/water', (req, res) => {
  const data = {
    ph: (6 + Math.random() * 3).toFixed(1),
    dissolved_oxygen: (5 + Math.random() * 5).toFixed(1),
    contaminants: (Math.random() * 10).toFixed(1)
  };
  res.json(data);
});

// Noise pollution route
app.get('/api/noise', (req, res) => {
  const data = {
    noise: (40 + Math.random() * 60).toFixed(1)
  };
  res.json(data);
});

// Health risk route
app.get('/api/risk', (req, res) => {
  const riskLevels = ['Low', 'Moderate', 'High'];
  const randomRisk = riskLevels[Math.floor(Math.random() * 3)];
  res.json({ risk: randomRisk });
});

// Historical pollution data
app.get('/api/pollution/history', (req, res) => {
  const history = [];
  const now = Date.now();
  for (let i = 0; i < 12; i++) {
    history.push({
      timestamp: now - i * 3600000,
      aqi: Math.floor(Math.random() * 201)
    });
  }
  res.json(history.reverse());
});

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
