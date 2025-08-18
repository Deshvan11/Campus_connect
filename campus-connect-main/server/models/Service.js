const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Laundry", "Meal Plan"
  description: { type: String },
  plans: [
    {
      name: String, // e.g., "Monthly Plan"
      duration: Number, // in days
      price: Number,
    },
  ],
});

module.exports = mongoose.model("Service", ServiceSchema);
