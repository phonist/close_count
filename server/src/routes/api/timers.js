const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Timer = require('../../models/Timer');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/timers
// @desc     Create a timer
// @access   Private
router.post(
  '/',
  auth,
  check('title', 'Title is required').notEmpty(),
  check('description', 'Description is required').notEmpty(),
  check('timer', 'Timer is required').notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newTimer = new Timer({
        title: req.body.title,
        description: req.body.description,
        timer: req.body.timer,
        user: req.user.id
      });
      const timer = await newTimer.save();

      res.status(201).json(timer);
    } catch (err) {
      next(err);
    }
  }
);

// @route    GET api/timers
// @desc     Get all timers
// @access   Private
router.get('/', auth, async (req, res, next) => {
  try {
    const timers = await Timer.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(timers);
  } catch (err) {
    next(err);
  }
});

// @route    GET api/timers/:id
// @desc     Get timer by ID
// @access   Private
router.get('/:id', auth, checkObjectId('id'), async (req, res, next) => {
  try {
    const timer = await Timer.findById(req.params.id);

    if (!timer) {
      return res.status(404).json({ msg: 'Timer not found' });
    }

    if (timer.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(timer);
  } catch (err) {
    next(err);
  }
});

// @route    DELETE api/timers/:id
// @desc     Delete a timer
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res, next) => {
  try {
    const timer = await Timer.findById(req.params.id);

    if (!timer) {
      return res.status(404).json({ msg: 'Timer not found' });
    }

    // Check user
    if (timer.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await timer.deleteOne();

    res.json({ msg: 'Timer removed' });
  } catch (err) {
    next(err);
  }
});

// @route    PUT api/timers/:id
// @desc     Update a timer
// @access   Private
router.put('/:id', auth, checkObjectId('id'), async (req, res, next) => {
  try {
    const timer = await Timer.findById(req.params.id);

    if (!timer) {
      return res.status(404).json({ msg: 'Timer not found' });
    }

    if (timer.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Check if the timer has already been activated
    if (timer.status === '1') {
      return res.status(400).json({ msg: 'Timer already activated' });
    }

    timer.status = '1';

    await timer.save();

    return res.json(timer);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
