const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  cabin: { type: String, required: true },
  workingHours: {
    start: { type: String, required: true }, // "09:00"
    end: { type: String, required: true }    // "16:00"
  },
  slots: [
    {
      start: { type: String, required: true },
      end: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model("Faculty", FacultySchema);
