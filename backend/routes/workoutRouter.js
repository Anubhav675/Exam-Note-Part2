const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth')
const {
  getAllWorkouts,
  createWorkout,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} = require('../controllers/workoutControllers');

// GET /api/workouts
router.get('/', getAllWorkouts);
router.get('/:workoutId', getWorkoutById);

// POST /api/workouts
router.post('/', createWorkout);

// GET /api/workouts/:workoutId

// PUT /api/workouts/:workoutId
router.put('/:workoutId', updateWorkout);

// DELETE /api/workouts/:workoutId
router.delete('/:workoutId', deleteWorkout);

module.exports = router;

