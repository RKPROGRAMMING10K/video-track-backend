const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  lastPosition: { type: Number, default: 0 },
  intervals: { type: [[Number]], default: [] }, // Array of [start, end] intervals
  percentage: { type: Number, default: 0 }, // Watched percentage
});

module.exports = mongoose.model("Progress", progressSchema);