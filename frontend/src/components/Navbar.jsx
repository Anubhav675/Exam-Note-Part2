import { Link } from "react-router-dom";
const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  let username = "";
  let role ="";
  if (storedUser) {
    username = storedUser.username;
    role = storedUser.role;
  }
  const handleClick = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };
  return (
    <nav className="navbar">
      <h1>Workout</h1>
      <div className="links">
        <Link to="/">Home</Link>
        {isAuthenticated && (
          <div>
            <Link to="/add-workout">Add Workout</Link>
            <span>
              {username} ({role})
            </span>
            <button onClick={handleClick}>Logout</button>
          </div>
        )}
        {!isAuthenticated && (
          <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
