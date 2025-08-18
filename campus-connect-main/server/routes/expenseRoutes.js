const express = require("express");
const Expense = require("../models/expense");
const User = require("../models/user");

const router = express.Router();

router.get('/:userId', async (req, res) => {
    try {

        // Find the user by userId
        const user = await User.findOne({userId: req.params.userId});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const expenses = await Expense.find({ userId: user._id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Add a new expense
router.post('/', async (req, res) => {
    const { userId, amount, category, date, notes } = req.body;

    const user = await User.findOne({userId: userId});
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    try {
        const newExpense = new Expense({ userId:user._id , amount, category, date, notes });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


module.exports = router;
