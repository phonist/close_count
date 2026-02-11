export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
}

export interface CreateTimerRequest {
  title: string;
  description: string;
  timer: string;
  isRecurring?: boolean;
  recurrence?: RecurrenceRule;
  timezone?: string;
}

export interface TimerResponse {
  _id: string;
  user: string;
  title: string;
  description: string;
  timer: string;
  status: '0' | '1';
  isRecurring: boolean;
  recurrence?: RecurrenceRule | null;
  timezone?: string | null;
  nextRunAt?: string | null;
  lastRunAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TimerListResponse = TimerResponse[];
