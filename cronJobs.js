const express = require("express");
const cron = require("node-cron");
const User = require("./models/User"); // Adjust path as necessary

const app = express();

// Schedule the task to run every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    // Find all users
    const users = await User.find();

    // Update recordingsPastWeek for each user
    users.forEach(async (user) => {
      // Shift left
      user.recordingsPastWeek.pop();
      user.recordingsPastWeek.unshift(0);

      // Save updated user
      await user.save();
    });

    console.log("Daily recordings update complete");
  } catch (error) {
    console.error("Error updating daily recordings:", error);
  }
});

// Start the Express server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
