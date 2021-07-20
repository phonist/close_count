const mongoose = require('mongoose');

const TimerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timer: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: '0'
  },
});

module.exports = mongoose.model('timer', TimerSchema);
