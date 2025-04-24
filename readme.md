# 📹 Video Progress Tracker

This project tracks and calculates how much of a video has been watched using unique watched intervals. It includes both frontend and backend components, with features like video progress calculation, interval merging, and cloud storage for media.

---

## 📁 File Structure

```
client/
├── components/
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── ProgressBar.jsx
│   └── VideoCard.jsx
├── pages/
│   ├── Home.jsx
│   └── VideoDetails.jsx
├── routes/
│   └── AppRouter.jsx
├── App.js
└── Main.js

backend/
├── Models/
│   ├── Progress.js
│   └── Video.js
├── Routes/
│   ├── ProgressRoute.js
│   └── VideoRoutes.js
├── Utils/
│   ├── cloudinary.js
│   └── intervalsUtils.js
├── .env
└── index.js
```

---

## ⚙️ Installation Process

### Prerequisites

- Node.js & npm
- MongoDB instance (local or cloud)
- Cloudinary account for media storage

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/video-progress-tracker.git
   cd video-progress-tracker
   ```

2. **Set up the environment variables**

   Create a `.env` file in the `backend/` folder with the following contents:

   ```env
   MONGO_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   npm start
   ```

4. **Install frontend dependencies**

   ```bash
   cd ../client
   npm install
   npm start
   ```

---

## 🧠 How It Works

### ✅ Tracking Watched Intervals

Each time a user watches a part of the video, the start and end times of that segment are saved in an array:

```js
[[start1, end1], [start2, end2], ...]
```

This array represents the segments the user has viewed.

---

### 🔄 Merging Intervals

To avoid counting overlapping or repeated segments multiple times, intervals are merged using the following function:

```js
const mergeIntervals = (intervals) => {
  if (!intervals.length) return [];

  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const [prevStart, prevEnd] = merged[merged.length - 1];
    const [currentStart, currentEnd] = intervals[i];

    if (currentStart <= prevEnd) {
      merged[merged.length - 1] = [prevStart, Math.max(prevEnd, currentEnd)];
    } else {
      merged.push(intervals[i]);
    }
  }

  return merged;
};
```

This ensures only unique segments contribute to progress.

---

### 📊 Calculating Watched Percentage

Once intervals are merged, progress is calculated using:

```js
const calculateProgress = () => {
  if (!video || !playerRef.current) return 0;

  const totalDuration = playerRef.current.getDuration();
  const watchedTime = watchedIntervals.reduce(
    (acc, [start, end]) => acc + (end - start),
    0
  );

  return ((watchedTime / totalDuration) * 100).toFixed(2);
};
```

---

## 🧹 Challenges & Solutions

### 1. **Handling Overlapping Intervals**
**Challenge**: Users might rewind or rewatch parts, creating overlapping segments.  
**Solution**: Used a sort-and-merge strategy to combine overlapping intervals into unique segments.

### 2. **Zero or Invalid Intervals**
**Challenge**: Intervals with zero length or invalid timestamps could skew progress.  
**Solution**: Filtered out such entries before calculations.

### 3. **Syncing with Video Player**
**Challenge**: Ensuring real-time progress updates while watching.  
**Solution**: Tied watched interval tracking to player events for real-time state updates.

---

## 📌 Conclusion

This project ensures accurate tracking of real user progress on lecture or tutorial videos. By merging watched intervals and calculating only unique durations, it gives a true picture of video engagement.

---

Feel free to contribute, report bugs, or suggest improvements!

