const express = require("express");
const router = express.Router();
const Data = require("../models/Data");
const { fetchAirQuality, simulateWaterNoise } = require("../utils/fetchData");

// Compute risk from AQI, water, noise
function getRisk(aqi, ph, noise) {
  if (aqi > 150) return "High";
  if (aqi > 100) return "Moderate";
  return "Low";
}

// Get latest pollution + save to DB
router.get("/pollution", async (req, res) => {
  try {
    const air = await fetchAirQuality();
    const waterNoise = simulateWaterNoise();
    const combined = { ...air, ...waterNoise, location: "Delhi" };

    const saved = await Data.create(combined);

    res.json(saved);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pollution data" });
  }
});

// Get latest risk
router.get("/risk", async (req, res) => {
  try {
    const latest = await Data.findOne().sort({ timestamp: -1 });
    if (!latest) return res.json({ risk: "Unknown" });

    const risk = getRisk(latest.aqi, latest.ph, latest.noise);
    res.json({ risk });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch risk data" });
  }
});

// Get latest tips
router.get("/tips", async (req, res) => {
  try {
    const latest = await Data.findOne().sort({ timestamp: -1 });
    if (!latest) return res.json({ tip: "No data available" });

    let tip = "All safe!";
    if (latest.aqi > 150) tip = "Stay indoors and wear a mask.";
    else if (latest.noise > 70) tip = "Avoid noisy areas or wear ear protection.";
    else if (latest.ph < 6.5 || latest.ph > 8.5) tip = "Water quality unsafe for drinking.";

    res.json({ tip });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tips" });
  }
});

// HISTORY endpoint for frontend chart
router.get("/pollution/history", async (req, res) => {
  try {
    const history = await Data.find().sort({ timestamp: 1 }).limit(20); // last 20 records
    res.json(history);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pollution history" });
  }
});

module.exports = router;
