import { Link } from "react-router-dom";
const Navbar = ({user, setUser}) => {
  const handleClick = ()=>{
    localStorage.removeItem("user");
    setUser(null);
  }
  return (
    <nav className="navbar">
      <h1>Workout</h1>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/add-workout">Add Workout</Link>
        {user ? (
          <>
          <span>{user.username}</span>
          <button onClick={handleClick}>Logout</button>
          </>
        ) : (
          <>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
        </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
