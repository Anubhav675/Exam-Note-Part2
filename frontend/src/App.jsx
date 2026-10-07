import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

// pages & components
import Home from "./pages/HomePage";
import AddWorkoutPage from "./pages/AddWorkoutPage";
import WorkoutPage from "./pages/WorkoutPage";
import EditWorkoutPage from "./pages/EditWorkoutPage";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

const App = () => {
const [user, setUser] = useState(()=>{
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
})

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar user={user} setUser={setUser} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-workout" element={<AddWorkoutPage />} />
            <Route path="/workouts/:id" element={<WorkoutPage />} />
            <Route path="/edit-workout/:id" element={<EditWorkoutPage />} />
            <Route path="/signup" element={<Signup setUser={setUser}/>} />
            <Route path="/login" element={<Login setUser={setUser}/>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
