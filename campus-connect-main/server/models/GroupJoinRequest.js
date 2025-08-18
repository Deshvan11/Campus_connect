const mongoose = require('mongoose');

const GroupJoinRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyGroup' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  });
  
  module.exports = mongoose.model('GroupJoinRequest', GroupJoinRequestSchema);