export interface Timer {
    _id: string;
    description: string;
    status: string;
    timer: string;
    title: string;
    user: string;
    isRecurring: boolean;
    recurrence?: {
        frequency: 'daily' | 'weekly' | 'monthly';
        interval?: number;
        daysOfWeek?: number[];
        dayOfMonth?: number;
    } | null;
    timezone?: string | null;
    nextRunAt?: string | null;
    lastRunAt?: string | null;
}
