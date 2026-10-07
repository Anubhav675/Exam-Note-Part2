import { useState } from "react";
import { useEffect } from "react";
import WorkoutListings from "../components/WorkoutListings";

const Home = () => {
  const [workouts, setWorkouts] = useState(null);
  const[isPending, setIsPending]=useState(true);
  const [error, setError] = useState("")

useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const res = await fetch("/api/workouts");
        if (!res.ok) {
          throw new Error("could not fetch the data for that resource");
        }
        const data = await res.json();
        setIsPending(false);
        setWorkouts(data);
        setError(null);
      } catch (err) {
        setIsPending(false);
        setError(err.message);
      }
    };
    fetchWorkout();
  }, []);


  return (
    <div className="home">
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      {workouts && <WorkoutListings workouts={workouts} />}
    </div>
  );
};

export default Home;

