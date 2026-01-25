import { Schema, model, Document, Types } from 'mongoose';

const TIMER_STATUSES = ['0', '1'] as const;
type TimerStatus = (typeof TIMER_STATUSES)[number];

export interface TimerDocument extends Document {
  user: Types.ObjectId;
  title: string;
  description: string;
  timer: string;
  status: TimerStatus;
  createdAt: Date;
  updatedAt: Date;
}

const TimerSchema = new Schema<TimerDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    timer: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: TIMER_STATUSES,
      default: '0',
    },
  },
  { timestamps: true }
);

TimerSchema.index({ user: 1, createdAt: -1 });
TimerSchema.index({ status: 1 });

export default model<TimerDocument>('timer', TimerSchema);
