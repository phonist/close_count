const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
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
}, { timestamps: true });

// Create indexes for better query performance
TimerSchema.index({ user: 1, createdAt: -1 });
TimerSchema.index({ status: 1 });

const Timer = mongoose.model('timer', TimerSchema);

module.exports = Timer;
