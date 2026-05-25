const express = require('express');
const router = express.Router();
const { dbService } = require('../config/db');

// @route   GET /api/goals
// @desc    Get user targets and physical goals
router.get('/', async (req, res) => {
  try {
    const goals = await dbService.goals.findOne();
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Server error retrieving goal data' });
  }
});

// @route   POST /api/goals
// @desc    Save user targets and BMR calculations
router.post('/', async (req, res) => {
  try {
    const updatedGoals = await dbService.goals.findOneAndUpdate(req.body);
    res.json(updatedGoals);
  } catch (error) {
    console.error('Error saving goals:', error);
    res.status(500).json({ message: 'Server error updating goal data' });
  }
});

module.exports = router;
