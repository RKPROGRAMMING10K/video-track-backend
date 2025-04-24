const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  name: String,
  description: String,
  videoUrl: String,
  thumbnailUrl: String,
  duration: { type: Number, required: true }, // Duration in seconds
});

module.exports = mongoose.model("Video", videoSchema);