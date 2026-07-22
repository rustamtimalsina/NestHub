import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
  <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
     <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

      <Link
  to="/"
  className="flex items-center gap-2 text-3xl font-extrabold text-blue-600 tracking-tight hover:scale-105 transition"
>
  🏡
  <span>NestHub</span>
</Link>

        <div className="flex items-center gap-3 text-gray-700 font-medium">

          <Link
  to="/"
  className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
>
  Home
</Link>

          <Link
  to="/properties"
  className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
>
  Properties
</Link>

          {token && (
            <>
              <Link
  to="/favorites"
  className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
>
   ❤️ Favorites
</Link>

              <Link
  to="/my-properties"
  className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
>
  🏠 My Properties
</Link>

              <Link
  to="/add-property"
  className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
>
  📝 Add Property
</Link>

              <button
                onClick={handleLogout}
               className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition"
              >
                Logout
              </button>
            </>
          )}

          {!token && (
            <>
              <Link
  to="/login"
  className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
>
  Login
</Link>

            <Link
  to="/register"
  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
>
  Register
</Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;