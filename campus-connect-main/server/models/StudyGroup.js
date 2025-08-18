const mongoose = require('mongoose');

const StudyGroupSchema = new mongoose.Schema({
    name: String,
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    domain: {
        type: String,  // Example: "Computer Science", "Mathematics"
        required: true
    },
    interests: [{
        type: String  // Example: ["Machine Learning", "Data Structures"]
    }]
  });
  
  module.exports = mongoose.model('StudyGroup', StudyGroupSchema);