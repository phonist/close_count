import { Schema, model, Document, Types } from 'mongoose';

const TIMER_STATUSES = ['0', '1'] as const;
const RECURRENCE_FREQUENCIES = ['daily', 'weekly', 'monthly'] as const;
type TimerStatus = (typeof TIMER_STATUSES)[number];
export type RecurrenceFrequency = (typeof RECURRENCE_FREQUENCIES)[number];

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
}

export interface TimerDocument extends Document {
  user: Types.ObjectId;
  title: string;
  description: string;
  timer: string;
  status: TimerStatus;
  isRecurring: boolean;
  recurrence?: RecurrenceRule;
  timezone?: string;
  nextRunAt?: Date;
  lastRunAt?: Date;
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
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrence: {
      frequency: {
        type: String,
        enum: RECURRENCE_FREQUENCIES,
      },
      interval: {
        type: Number,
        min: 1,
        default: 1,
      },
      daysOfWeek: {
        type: [Number],
      },
      dayOfMonth: {
        type: Number,
        min: 1,
        max: 31,
      },
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    nextRunAt: {
      type: Date,
    },
    lastRunAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

TimerSchema.index({ user: 1, createdAt: -1 });
TimerSchema.index({ status: 1 });
TimerSchema.index({ nextRunAt: 1 });

export default model<TimerDocument>('timer', TimerSchema);
