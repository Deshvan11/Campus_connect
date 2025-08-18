// models/GroupMessage.js
const mongoose = require('mongoose');

const groupMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  message: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroupMessage', groupMessageSchema);
