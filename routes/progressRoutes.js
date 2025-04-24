const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");
const Video = require("../models/Video"); // Import the Video model

// Get progress for all videos
router.get("/", async (req, res) => {
  try {
    const progress = await Progress.find();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get progress for a specific video by ID
router.get("/:videoId", async (req, res) => {
  const { videoId } = req.params;
  try {
    const progress = await Progress.findOne({ videoId });
    if (!progress) {
      // Return a default progress object if no progress is found
      return res.json({
        videoId,
        lastPosition: 0,
        intervals: [],
        percentage: 0,
      });
    }
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove progress for a specific video
router.delete("/:videoId", async (req, res) => {
  const { videoId } = req.params;
  try {
    await Progress.deleteOne({ videoId });
    res.json({ message: "Progress removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save progress for a specific video
router.post("/:videoId", async (req, res) => {
  const { videoId } = req.params;
  const { lastPosition, intervals, percentage } = req.body;

  console.log("Saving progress for video:", videoId);
  console.log("Last Position:", lastPosition);
  console.log("Intervals:", intervals);

  try {
    // Fetch the video duration from the Video model
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const totalDuration = video.duration || 0; // Ensure totalDuration is not undefined
    if (totalDuration === 0) {
      return res.status(400).json({ error: "Video duration is invalid" });
    }

    const watchedTime = intervals.reduce((acc, [start, end]) => acc + (end - start), 0);
    const calculatedPercentage = Math.min(
      ((watchedTime / totalDuration) * 100).toFixed(2),
      100
    );

    // Use `findOneAndUpdate` to either update or create a new document
    const progress = await Progress.findOneAndUpdate(
      { videoId }, // Find by videoId
      {
        videoId,
        lastPosition,
        intervals,
        percentage: calculatedPercentage, // Ensure percentage is valid
      },
      { upsert: true, new: true } // Create if not found, return the updated document
    );

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;