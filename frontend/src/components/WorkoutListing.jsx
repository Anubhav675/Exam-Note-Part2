import { Link } from "react-router-dom";
const WorkoutListing = ({workout}) => {

  return (
    <div className="workout-preview">
      
        <Link to={`/workouts/${workout.id}`}>
        <h2>{workout.title}</h2>
        </Link>
      <p>Difficulty: {workout.difficulty}</p>
      <p>{workout.description}</p>
      <p>Price: ${workout.price}</p>
    </div>
  );
};

export default WorkoutListing;
