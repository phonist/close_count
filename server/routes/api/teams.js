const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Timer = require('../../models/Team');
const Team = require('../../models/Team');
const User = require('../../models/User');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/teams
// @desc     Create a team
// @access   Private
router.post(
  '/',
  auth,
  check('name', 'Name is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      
      const newTeam = new Team({
        name: req.body.title,
        description: req.body.description,
        status: req.body.timer,
        user: req.user.id
      });
      const team = await newTeam.save();

      res.json(team);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/teams
// @desc     Get all teams
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const teams = await Team.find({user: req.user.id}).sort({ date: -1 });
    res.json(teams);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route    GET api/teams/:id
// @desc     Get team by ID
// @access   Private
router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    }

    res.json(team);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/teams/:id
// @desc     Delete a team
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!timer) {
      return res.status(404).json({ msg: 'Timer not found' });
    }

    // Check user
    if (timer.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await timer.remove();

    res.json({ msg: 'Timer removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    PUT api/timers/:id
// @desc     Update a timer
// @access   Private
router.put('/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const timer = await Timer.findById(req.params.id);

    // Check if the timer has already been activated
    if(timer.status === '1'){
      return res.status(400).json({ msg: 'Timer already activated' });
    }

    timer.status = '1';

    await timer.save();

    return res.json(timer.status);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
