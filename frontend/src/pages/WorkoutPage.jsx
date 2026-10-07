import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const WorkoutPage = ({isAuthenticated}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const deleteWorkout = async (workoutId) => {
    try {
      const res = await fetch(`/api/workouts/${workoutId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete workout");
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const res = await fetch(`/api/workouts/${id}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setWorkout(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  const onDeleteClick = async (workoutId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this workout?",
    );
    if (!confirm) return;
    await deleteWorkout(workoutId);
    navigate("/");
  };

  return (
    <div className="workout-preview">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>{workout.title}</h2>
          <p>Difficulty: {workout.difficulty}</p>
          <p>Description: {workout.description}</p>
          <p>Price: ${workout.price}</p>
          {isAuthenticated && (
            <>
              <button onClick={() => onDeleteClick(workout._id)}>Delete</button>
              <button onClick={() => navigate(`/edit-workout/${workout._id}`)}>
                Edit
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default WorkoutPage;
