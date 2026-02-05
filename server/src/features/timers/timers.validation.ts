import { check } from 'express-validator';

const createTimerValidation = [
  check('title', 'Title is required').notEmpty(),
  check('description', 'Description is required').notEmpty(),
  check('timer', 'Timer is required').notEmpty(),
  check('timer').custom((value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new Error('Timer must be a valid date');
    }
    if (date.getTime() < Date.now()) {
      throw new Error('Timer must be in the future');
    }
    return true;
  }),
  check('isRecurring').optional().isBoolean(),
  check('timezone').optional().isString(),
  check('recurrence').custom((value, { req }) => {
    if (!req.body?.isRecurring) {
      return true;
    }
    if (!value || typeof value !== 'object') {
      throw new Error('Recurrence is required');
    }
    return true;
  }),
  check('recurrence.frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly']),
  check('recurrence.interval')
    .optional()
    .isInt({ min: 1 }),
  check('recurrence.daysOfWeek')
    .optional()
    .isArray(),
  check('recurrence.daysOfWeek.*')
    .optional()
    .isInt({ min: 0, max: 6 }),
  check('recurrence.dayOfMonth')
    .optional()
    .isInt({ min: 1, max: 31 }),
];

export { createTimerValidation };
