const express = require("express");
const router = express.Router();
const Data = require("../models/Data");
const { fetchAirQuality, simulateWaterNoise } = require("../utils/fetchData");

function getRisk(aqi, ph, noise) {
  if (aqi > 150) return "High";
  if (aqi > 100) return "Moderate";
  return "Low";
}

router.get("/pollution", async (req, res) => {
  const air = await fetchAirQuality();
  const waterNoise = simulateWaterNoise();
  const combined = { ...air, ...waterNoise, location: "Delhi" };

  const saved = await Data.create(combined);
  res.json(saved);
});

router.get("/risk", async (req, res) => {
  const latest = await Data.findOne().sort({ timestamp: -1 });
  if (!latest) return res.json({ risk: "Unknown" });

  const risk = getRisk(latest.aqi, latest.ph, latest.noise);
  res.json({ risk });
});

router.get("/tips", async (req, res) => {
  const latest = await Data.findOne().sort({ timestamp: -1 });
  if (!latest) return res.json({ tip: "No data available" });

  let tip = "All safe!";
  if (latest.aqi > 150) tip = "Stay indoors and wear a mask.";
  else if (latest.noise > 70) tip = "Avoid noisy areas or wear ear protection.";
  else if (latest.ph < 6.5 || latest.ph > 8.5) tip = "Water quality unsafe for drinking.";

  res.json({ tip });
});

module.exports = router;
