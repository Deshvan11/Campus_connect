const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  amount: { type: Number, required: true },
  category: { type: String, required: true }, // Example: "Food", "Transport", etc.
  date: { type: Date, required: true },
  notes: { type: String }, // Optional notes about the expense
  createdAt: { type: Date, default: Date.now },
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
