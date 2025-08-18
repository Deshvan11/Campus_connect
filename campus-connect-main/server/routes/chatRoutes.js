// routes/chatRoutes.js
const router = require('express').Router();
const Message = require('../models/Message');
const User = require('../models/user');
const GroupMessage = require('../models/GroupMessage');

// Get chat between 2 users
router.get('/:user1/:user2', async (req, res) => {

    const user1 = await User.findOne({userId: req.params.user1});
    if(!user1) {
        return res.status(404).json({ message: 'User not found' });
    }

    console.log(user1._id, req.params.user2);

  const messages = await Message.find({
    $or: [
      { sender: user1._id, receiver: req.params.user2 },
      { sender: req.params.user2, receiver: user1._id },
    ]
  }).sort({ timestamp: 1 }).populate('sender', 'name').populate('receiver', 'name');
  // console.log(messages);
  res.json(messages);
});

router.get('/:groupId', async (req, res) => {
    const messages = await GroupMessage.find({ group: req.params.groupId })
      .sort({ timestamp: 1 })
      .populate('sender', 'name');
  
    res.json(messages);
  });

module.exports = router;
