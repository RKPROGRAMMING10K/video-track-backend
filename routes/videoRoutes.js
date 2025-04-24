const express = require("express");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const Video = require("../models/Video");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all videos
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().sort({ _id: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload a new video
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const videoFile = req.files.video;
    const thumbnailFile = req.files.thumbnail;

    // Upload video to Cloudinary
    const videoResult = await cloudinary.uploader.upload(videoFile.tempFilePath, {
      resource_type: "video",
    });

    // Upload thumbnail to Cloudinary
    const thumbnailResult = await cloudinary.uploader.upload(thumbnailFile.tempFilePath, {
      folder: "thumbnails",
    });

    // Get video duration from Cloudinary metadata
    const duration = videoResult.duration; // Duration in seconds

    if (!duration) {
      return res.status(500).json({ error: "Failed to fetch video duration from Cloudinary" });
    }

    // Save video details to the database
    const newVideo = new Video({
      name,
      description,
      videoUrl: videoResult.secure_url,
      thumbnailUrl: thumbnailResult.secure_url,
      duration,
    });

    await newVideo.save();
    res.json(newVideo);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;