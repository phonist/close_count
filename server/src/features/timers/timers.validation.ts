import { check } from 'express-validator';

const createTimerValidation = [
  check('title', 'Title is required').notEmpty(),
  check('description', 'Description is required').notEmpty(),
  check('timer', 'Timer is required').notEmpty(),
];

export { createTimerValidation };
