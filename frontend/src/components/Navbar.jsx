import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <Link
          to="/"
          className="text-2xl font-bold"
        >
          🏡 NestHub
        </Link>

        <div className="flex gap-6 items-center">

          <Link to="/">Home</Link>

          <Link to="/properties">Properties</Link>

          {token && (
            <>
              <Link to="/favorites">Favorites</Link>

              <Link to="/my-properties">My Properties</Link>

              <Link to="/add-property">Add Property</Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}

          {!token && (
            <>
              <Link to="/login">Login</Link>

              <Link to="/register">Register</Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;