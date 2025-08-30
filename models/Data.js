const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  location: String,
  pm25: Number,
  pm10: Number,
  no2: Number,
  o3: Number,
  co: Number,
  aqi: Number,
  ph: Number,
  dissolved_oxygen: Number,
  contaminants: Number,
  noise: Number
});

module.exports = mongoose.model("Data", DataSchema);
