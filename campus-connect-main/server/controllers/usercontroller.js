const User = require("../models/user");

// Update user profile
const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const updatedData = req.body;

  try {
    // Find the user by userId and update their profile
    const user = await User.findOneAndUpdate({ userId }, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId }, { password: 0 }); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

module.exports = { updateProfile, getProfile };