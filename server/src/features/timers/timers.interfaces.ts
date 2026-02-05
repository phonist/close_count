export interface CreateTimerInput {
  title: string;
  description: string;
  timer: string;
  user: string;
  isRecurring?: boolean;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval?: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
  };
  timezone?: string;
  nextRunAt?: Date;
}