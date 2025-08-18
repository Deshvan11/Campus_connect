const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  planName: String,
  amount: Number,
  startDate: { type: Date, default: Date.now },
  renewalDate: { type: Date, required: true }, // Auto-calculated based on plan duration
  status: { type: String, enum: ["active", "expired"], default: "active" },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
