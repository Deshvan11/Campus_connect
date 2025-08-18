const express = require("express");
const { updateProfile, getProfile } = require("../controllers/usercontroller");
const ConnectionRequest = require("../models/ConnectionRequestSchema");
const GroupJoinRequest = require("../models/GroupJoinRequest");
const User = require("../models/user");
const StudyGroup = require("../models/StudyGroup");
const Faculty = require("../models/Faculty");

const router = express.Router();

// Update user profile
router.put("/profile/:userId", updateProfile);

// Get user profile
router.get("/profile/:userId", getProfile);

// Get All Users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get all connection requests for a user
router.get("/connection-requests/:userId", async (req, res) => {
    try {

        const user = await User.findOne({userId: req.params.userId});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch connection requests
        const connectionRequests = await ConnectionRequest.find({ receiver: user._id })
            .populate('sender', 'name email');

        // Fetch group join requests for groups created by the user
        const groupJoinRequests = await GroupJoinRequest.find()
            .populate({
                path: 'group',
                match: { creator: user._id }, // Only include groups created by the user
                select: 'name'
            })
            .populate('user', 'name email');

        // Filter out group join requests where the group is null (not created by the user)
        const filteredGroupJoinRequests = groupJoinRequests.filter(request => request.group);

        // Check if there are no requests
        if (connectionRequests.length === 0 && filteredGroupJoinRequests.length === 0) {
            return res.status(404).json({ message: "No connection or group join requests found." });
        }

        res.json({
            connectionRequests,
            groupJoinRequests: filteredGroupJoinRequests
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/connect', async (req, res) => {

    const {senderId, receiverId} = req.body;

    const sender = await User.findOne({userId: senderId});

    const request = new ConnectionRequest({
      sender: sender._id,
      receiver: receiverId,
    });
    await request.save();
    res.json({ message: 'Request sent' });
  });
  
  router.post('/connect/accept/:id', async (req, res) => {
    try {
        const request = await ConnectionRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Connection request not found' });
        }

        if (request.status === 'accepted') {
            return res.status(400).json({ message: 'Request already accepted' });
        }

        request.status = 'accepted';
        await request.save();

        // Add sender to receiver's followers list
        await User.findByIdAndUpdate(request.receiver, {
            $addToSet: { followers: request.sender }
        });

        // Add receiver to sender's following list
        await User.findByIdAndUpdate(request.sender, {
            $addToSet: { following: request.receiver }
        });

        res.json({ message: 'Request accepted and users updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/study-buddy/stats/:userId', async (req, res) => {
    try {
        // Replace `userId` with the actual user ID from the request (e.g., from req.user or query params)
        const userId = req.params.userId;

        // Fetch user data
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate stats
        const connections = user.following.length; // Number of users the user is following
        const groupsJoined = await StudyGroup.countDocuments({ members: user._id }); // Number of groups the user has joined
        const groupsCreated = await StudyGroup.countDocuments({ creator: user._id }); // Groups created by the user

        // Return stats
        res.json({
            connections,
            groupsJoined,
            groupsCreated,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get("/faculty/:name", async (req, res) => {
    try {

        console.log(req.params.name);

      const faculty = await Faculty.findOne({ name: new RegExp(`^${req.params.name}$`, "i") });
      if (!faculty) return res.status(404).json({ message: "Faculty not found" });
  
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
  
      const isWorking = currentTime >= faculty.workingHours.start && currentTime <= faculty.workingHours.end;
      const isFree = faculty.slots.every(slot => currentTime < slot.start || currentTime >= slot.end);
  
      res.json({
        name: faculty.name,
        cabin: faculty.cabin,
        isFree: isWorking ? isFree : false,
        isWorking,
        currentTime
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  router.get('/profile/complete/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find the user by userId
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check for missing or empty fields
      const missingFields = [];
      if (!user.name || user.name.trim() === '') missingFields.push('name');
      if (!user.phoneNumber || user.phoneNumber.trim() === '') missingFields.push('phoneNumber');
      if (!user.studyDomain || user.studyDomain.trim() === '') missingFields.push('studyDomain');
      if (!user.interests || user.interests.length === 0) missingFields.push('interests');
  
      // If there are missing fields, return them
      if (missingFields.length > 0) {
        return res.status(200).json({
          isComplete: false,
          missingFields,
        });
      }
  
      // If no fields are missing, the profile is complete
      res.status(200).json({
        isComplete: true,
        message: 'Profile is complete',
      });
    } catch (error) {
      console.error('Error checking profile completeness:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

module.exports = router;
