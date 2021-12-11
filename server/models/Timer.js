const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
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

const Timer = mongoose.model('timer', TimerSchema);

module.exports = Timer;
