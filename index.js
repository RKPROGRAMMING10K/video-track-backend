const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const videoRoutes = require("./routes/videoRoutes");
const progressRoutes = require("./routes/progressRoutes");
const Video = require("./models/Video"); // Import the Video model

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api/videos", videoRoutes);
app.use("/api/progress", progressRoutes);

// Get specific video by ID
app.get("/api/videos/:videoId", async (req, res) => {
  const { videoId } = req.params;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server started on port 5000"));
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});