const Workout = require('../models/workoutModel');
const mongoose = require('mongoose');

// GET /api/workouts
const getAllWorkouts = async (req, res) => {
  try {
    const findAllWorkout = await Workout.find({})
    res.status(200).json(findAllWorkout)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

// POST /api/workouts
const createWorkout = async (req, res) => {
  const { title, difficulty, description, price } = req.body;
  console.log(title, difficulty, description, price)
  if (!title || !difficulty ||  !description || !price ) {

    return res.status(400).json({ error: "Please fill the missing fields" })
  }
  try {
    const newWorkout = await Workout.create(req.body)
    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(400).json({ error: "Failed to create Workout" })
  }
};

// GET /api/workouts/:workoutId
const getWorkoutById = async (req, res) => {
 const { workoutId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workoutId)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  try {
    const workout = await Workout.findById(workoutId);
    if (workout) {
      res.status(200).json(workout);
    } else {
      res.status(404).json({ message: "Workout not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve workout" });
  }
};

// PUT /api/workouts/:workoutId
const updateWorkout = async (req, res) => {
   const { workoutId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workoutId)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  try {
    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: workoutId },
      { ...req.body },
      { returnDocument: "after", runValidators: true}
    );
    if (updatedWorkout) {
      res.status(200).json(updatedWorkout);
    } else {
      res.status(404).json({ message: "Workout not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update workout" });
  }
};

// DELETE /api/workouts/:workoutId
const deleteWorkout = async (req, res) => {
 const { workoutId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workoutId)) {
    return res.status(400).json({ message: "Invalid workout ID" });
  }

  try {
    const deletedWorkout = await Workout.findOneAndDelete({ _id: workoutId });
    if (deletedWorkout) {
      res.status(204).send(); // 204 No Content
    } else {
      res.status(404).json({ message: "Workout not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete workout" });
  }
};

module.exports = {
  getAllWorkouts,
  createWorkout,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
};

