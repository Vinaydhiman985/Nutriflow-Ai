const express = require('express');
const router = express.Router();
const { dbService } = require('../config/db');

// @route   GET /api/meals
// @desc    Get all meals logged for a specific date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required (YYYY-MM-DD)' });
    }
    const meals = await dbService.meals.find({ date });
    res.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ message: 'Server error retrieving meal data' });
  }
});

// @route   POST /api/meals
// @desc    Log a new meal
router.post('/', async (req, res) => {
  try {
    const { title, calories, protein, carbs, fats, mealType, date, aiAnalysis, time } = req.body;
    
    // Validation
    if (!title || calories === undefined || !mealType || !date) {
      return res.status(400).json({ message: 'Please provide title, calories, mealType, and date.' });
    }

    const newMeal = await dbService.meals.create({
      title,
      calories: Number(calories),
      protein: Number(protein || 0),
      carbs: Number(carbs || 0),
      fats: Number(fats || 0),
      mealType,
      date,
      aiAnalysis: !!aiAnalysis,
      time
    });

    res.status(201).json(newMeal);
  } catch (error) {
    console.error('Error logging meal:', error);
    res.status(500).json({ message: 'Server error saving meal data' });
  }
});

// @route   DELETE /api/meals/:id
// @desc    Remove a meal log
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await dbService.meals.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Meal log not found' });
    }
    res.json({ message: 'Meal logged deleted successfully', deleted });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ message: 'Server error deleting meal data' });
  }
});

module.exports = router;
