const axios = require("axios");

async function fetchAirQuality() {
  const API_KEY = process.env.OPENWEATHER_KEY;
  const LAT = 28.6139, LON = 77.2090; // Delhi
  const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${LAT}&lon=${LON}&appid=${API_KEY}`;
  
  console.log("Using API Key:", process.env.OPENWEATHER_KEY);

  const res = await axios.get(url);
  const d = res.data.list[0];
  return {
    pm25: d.components.pm2_5,
    pm10: d.components.pm10,
    no2: d.components.no2,
    o3: d.components.o3,
    co: d.components.co,
    aqi: d.main.aqi
  };
}

function simulateWaterNoise() {
  return {
    ph: (6.5 + Math.random() * 2).toFixed(2),
    dissolved_oxygen: (5 + Math.random() * 5).toFixed(2),
    contaminants: (Math.random() * 50).toFixed(2),
    noise: (40 + Math.random() * 50).toFixed(1)
  };
}

module.exports = { fetchAirQuality, simulateWaterNoise };
