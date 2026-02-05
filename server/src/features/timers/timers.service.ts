import Timer, { RecurrenceRule, TimerDocument } from '../../models/timer.model';
import type { CreateTimerInput } from './timers.interfaces';

const MAX_LOOKAHEAD_DAYS = 365 * 5;

const parseDateValue = (value?: string | Date | null): Date | null => {
  if (!value) {
    return null;
  }
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const addMonths = (date: Date, months: number) => {
  const next = new Date(date);
  const desiredMonth = next.getMonth() + months;
  next.setMonth(desiredMonth);
  return next;
};

const startOfWeek = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start;
};

const diffWeeks = (from: Date, to: Date) => {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor((to.getTime() - from.getTime()) / msPerWeek);
};

const applyTimeFrom = (target: Date, source: Date) => {
  target.setHours(
    source.getHours(),
    source.getMinutes(),
    source.getSeconds(),
    source.getMilliseconds()
  );
};

const computeNextRunAt = (
  startAt: Date,
  recurrence: RecurrenceRule,
  now = new Date()
): Date => {
  const interval = recurrence.interval ?? 1;
  const base = new Date(startAt);
  const baseTime = new Date(startAt);

  if (recurrence.frequency === 'daily') {
    let next = new Date(base);
    while (next <= now) {
      next = addDays(next, interval);
    }
    return next;
  }

  if (recurrence.frequency === 'weekly') {
    const daysOfWeek =
      recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0
        ? recurrence.daysOfWeek
        : [base.getDay()];

    let cursor = new Date(now.getTime() + 1000);
    if (cursor < base) {
      cursor = new Date(base);
    }
    applyTimeFrom(cursor, baseTime);

    for (let i = 0; i < MAX_LOOKAHEAD_DAYS; i += 1) {
      if (cursor >= base) {
        const weeksBetween = diffWeeks(startOfWeek(base), startOfWeek(cursor));
        if (weeksBetween % interval === 0 && daysOfWeek.includes(cursor.getDay())) {
          if (cursor > now) {
            return cursor;
          }
        }
      }
      cursor = addDays(cursor, 1);
      applyTimeFrom(cursor, baseTime);
    }

    return addDays(base, interval * 7);
  }

  const dayOfMonth = recurrence.dayOfMonth ?? base.getDate();
  let next = new Date(base);

  while (true) {
    const year = next.getFullYear();
    const month = next.getMonth();
    const cappedDay = Math.min(dayOfMonth, daysInMonth(year, month));
    const candidate = new Date(year, month, cappedDay);
    applyTimeFrom(candidate, baseTime);
    if (candidate > now) {
      return candidate;
    }
    next = addMonths(next, interval);
  }
};

const advanceTimerIfNeeded = async (timer: TimerDocument, now = new Date()) => {
  if (!timer.isRecurring) {
    if (!timer.nextRunAt) {
      const parsed = parseDateValue(timer.timer);
      if (parsed) {
        timer.nextRunAt = parsed;
        await timer.save();
      }
    }
    return timer;
  }

  if (!timer.recurrence) {
    return timer;
  }

  const startAt = parseDateValue(timer.timer) ?? timer.nextRunAt ?? now;
  const currentNext = timer.nextRunAt ?? computeNextRunAt(startAt, timer.recurrence, now);
  if (currentNext <= now) {
    const nextRunAt = computeNextRunAt(startAt, timer.recurrence, now);
    if (!timer.nextRunAt || timer.nextRunAt.getTime() !== nextRunAt.getTime()) {
      timer.lastRunAt = timer.nextRunAt ?? currentNext;
      timer.nextRunAt = nextRunAt;
      await timer.save();
    }
    return timer;
  }

  if (!timer.nextRunAt) {
    timer.nextRunAt = currentNext;
    await timer.save();
  }

  return timer;
};

const createTimer = ({
  title,
  description,
  timer,
  user,
  isRecurring,
  recurrence,
  timezone,
  nextRunAt,
}: CreateTimerInput) =>
  new Timer({
    title,
    description,
    timer,
    user,
    isRecurring: Boolean(isRecurring),
    recurrence,
    timezone,
    nextRunAt,
  });

const listTimersByUser = (userId: string) =>
  Timer.find({ user: userId }).sort({ createdAt: -1 });

const findTimerById = (id: string) => Timer.findById(id);

const deleteTimer = (timer: TimerDocument) => timer.deleteOne();

const forceAdvanceTimer = async (timer: TimerDocument, now = new Date()) => {
  if (!timer.isRecurring || !timer.recurrence) {
    return timer;
  }

  const startAt = parseDateValue(timer.timer) ?? timer.nextRunAt ?? now;
  const nextRunAt = computeNextRunAt(startAt, timer.recurrence, now);
  timer.lastRunAt = timer.nextRunAt ?? startAt;
  timer.nextRunAt = nextRunAt;
  await timer.save();
  return timer;
};

export {
  createTimer,
  listTimersByUser,
  findTimerById,
  deleteTimer,
  computeNextRunAt,
  advanceTimerIfNeeded,
  forceAdvanceTimer,
  parseDateValue,
};
