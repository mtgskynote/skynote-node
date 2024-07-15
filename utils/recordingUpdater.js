import User from "../models/User.js";

export const updateRecordings = async () => {
  try {
    const users = await User.find();

    const promises = users.map(async (user) => {
      // Remove the first element and add a 0 at the end
      user.recordingsPastWeek.shift();
      user.recordingsPastWeek.push(0);
      await user.save();
    });

    await Promise.all(promises);
    console.log("Daily recordings update complete");
  } catch (error) {
    console.error("Error updating daily recordings:", error);
  }
};
