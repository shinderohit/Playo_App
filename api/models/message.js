const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game', 
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Message', messageSchema);