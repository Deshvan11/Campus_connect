const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true }, // Auto-generated ID like S0001
  enrollmentNumber: { type: String, unique: true, required: true },
  email: { type: String, unique: true, sparse: true }, // Optional for login with enrollment number
  password: { type: String, required: true },
  name: { type: String },
  phoneNumber: { type: String },
  interests: { type: [String] }, // Array of selected domains
  studyDomain: { type: String }, // Selected domain
  budget: { type: Number, default: 0 }, // Default budget
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudyGroup' }],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;