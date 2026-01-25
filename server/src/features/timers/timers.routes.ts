import { Router } from 'express';
import auth from '../../middlewares/auth';
import checkObjectId from '../../middlewares/checkObjectId';
import validateRequest from '../../middlewares/validate';
import { createTimerValidation } from './timers.validation';
import {
  createTimerHandler,
  listTimers,
  getTimer,
  deleteTimerHandler,
  activateTimer,
} from './timers.controller';

const router = Router();

/**
 * @openapi
 * /api/timers:
 *   post:
 *     summary: Create a timer
 *     tags: [Timers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTimerRequest'
 *     responses:
 *       201:
 *         description: Created timer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimerResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.post('/', auth, createTimerValidation, validateRequest, createTimerHandler);

/**
 * @openapi
 * /api/timers:
 *   get:
 *     summary: Get all timers for the current user
 *     tags: [Timers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of timers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimerListResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.get('/', auth, listTimers);

/**
 * @openapi
 * /api/timers/{id}:
 *   get:
 *     summary: Get timer by ID
 *     tags: [Timers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Timer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimerResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         description: Timer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.get('/:id', auth, checkObjectId('id'), getTimer);

/**
 * @openapi
 * /api/timers/{id}:
 *   delete:
 *     summary: Delete a timer
 *     tags: [Timers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Timer removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         description: Timer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.delete('/:id', auth, checkObjectId('id'), deleteTimerHandler);

/**
 * @openapi
 * /api/timers/{id}:
 *   put:
 *     summary: Activate a timer
 *     tags: [Timers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated timer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimerResponse'
 *       400:
 *         description: Timer already activated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         description: Timer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.put('/:id', auth, checkObjectId('id'), activateTimer);

export default router;
