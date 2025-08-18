const StudyGroup = require('../models/StudyGroup');
const GroupJoinRequest = require('../models/GroupJoinRequest');

const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Get all study groups
router.get('/', async (req, res) => {
  const groups = await StudyGroup.find().populate('creator', 'name email');
  res.json(groups);
});

// Create a group
router.post('/', async (req, res) => {

    const { name, description, domain, interests, userId } = req.body;

    const user = await User.findOne({userId: userId});
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

  const group = new StudyGroup({
    name: req.body.name,
    description: req.body.description,
    creator: user._id,
    members: [user._id],
    domain: req.body.domain,
    interests: req.body.interests,
  });
  await group.save();
  res.json(group);
});

// Request to join a group
router.post('/join/:id', async (req, res) => {

    const {senderId} = req.body;
    console.log(senderId, req.params.id);
    const sender = await User.findOne({userId: senderId});

    if (!sender) {
        return res.status(404).json({ message: 'User not found' });
    }
  const request = new GroupJoinRequest({
    user: sender._id,
    group: req.params.id,
  });
  await request.save();
  res.json({ message: 'Join request sent' });
});

// Accept group join request
router.post('/join/accept/:id', async (req, res) => {
    console.log(req.params.id);
  const request = await GroupJoinRequest.findById(req.params.id);
  request.status = 'accepted';
  await request.save();

    // Add user to group members
    const studygroup = await StudyGroup.findById(request.group);
    studygroup.members.push(request.user);
    await studygroup.save();

  res.json({ message: 'User added to group' });
});

module.exports = router;