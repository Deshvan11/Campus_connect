const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    const user = await User.findOne({ userId: userId });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({ budget: user.budget });
});

// Update user's budget
router.put('/:userId', async (req, res) => {
    const { budget } = req.body;

    const existingUser = await User.findOne({ userId: req.params.userId });
    if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    try {
        const user = await User.findByIdAndUpdate(existingUser._id , { budget }, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
