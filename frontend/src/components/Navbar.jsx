import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import api from "../services/api";
import {
  House,
  Building2,
  Heart,
  PlusSquare,
  CircleUserRound,
  LogOut,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
const [user, setUser] = useState(null);

const token = localStorage.getItem("token");
useEffect(() => {
  async function loadUser() {
    if (!token) {
      setUser(null);
      return;
    }

    try {
  const response = await api.get("/users/me");
  setUser(response.data);
} catch (error) {
  console.error("Failed to load user:", error);
  setUser(null);
}
  }

  loadUser();
}, [token]);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className="relative sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
     <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

      <Link
  to="/"
  className="flex items-center gap-2 text-3xl font-extrabold text-blue-600 tracking-tight hover:scale-105 transition"
>
   <House size={32} />
  <span>NestHub</span>
</Link>

           <>
  {/* Desktop Menu */}
  <div className="hidden md:flex items-center gap-3 text-gray-700 font-medium">
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
   <div className="flex items-center gap-2">
    <Heart size={18} />
    Favorites
</div>
</Link>

              <Link
  to="/my-properties"
  className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
>
  <div className="flex items-center gap-2">
    <Building2 size={18} />
    My Properties
</div>
</Link>

              <Link
  to="/add-property"
  className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
>
  <div className="flex items-center gap-2">
    <PlusSquare size={18} />
    Add Property
</div>
</Link>
{user?.role === "admin" && (
  <>
    <Link
      to="/admin/dashboard"
      className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
    >
      Admin Dashboard
    </Link>

    <Link
      to="/admin/users"
      className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
    >
      User Management
    </Link>

    <Link
      to="/admin/properties"
      className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
    >
      Property Management
    </Link>
  </>
)}
<div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
    <CircleUserRound
        size={22}
        className="text-blue-600"
    />

    <span>
        User
    </span>
</div>

              <button
                onClick={handleLogout}
               className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition"
              >
               <div className="flex items-center gap-2">
    <LogOut size={18} />
    Logout
</div>
              </button>
            </>
          )}


          {!token && (
            <>
              <Link
  to="/login"
  className="px-4 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"
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
    {/* Mobile Menu Button */}
<button
  className="md:hidden text-gray-700"
  onClick={() => setMenuOpen(!menuOpen)}
>
  {menuOpen ? <X size={30} /> : <Menu size={30} />}
</button>
{menuOpen && (
  <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg md:hidden">

    <div className="flex flex-col p-4 space-y-2">

      <Link
  to="/"
  onClick={() => setMenuOpen(false)}
  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50"
>
  <House size={18} />
  Home
</Link>

    <Link
  to="/properties"
  onClick={() => setMenuOpen(false)}
  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50"
>
  <Building2 size={18} />
  Properties
</Link>

      {token ? (
        <>
         <Link
  to="/favorites"
  onClick={() => setMenuOpen(false)}
  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50"
>
  <Heart size={18} />
  Favorites
</Link>

          <Link
  to="/my-properties"
  onClick={() => setMenuOpen(false)}
  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50"
>
  <Building2 size={18} />
  My Properties
</Link>

         <Link
  to="/add-property"
  onClick={() => setMenuOpen(false)}
  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50"
>
  <PlusSquare size={18} />
  Add Property
</Link>
{user?.role === "admin" && (
  <>
    <Link
      to="/admin/dashboard"
      onClick={() => setMenuOpen(false)}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50"
    >
      Admin Dashboard
    </Link>

    <Link
      to="/admin/users"
      onClick={() => setMenuOpen(false)}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50"
    >
      User Management
    </Link>
  </>
)}

        <button
  onClick={() => {
    handleLogout();
    setMenuOpen(false);
  }}
  className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 transition"
>
  <LogOut size={18} />
  Logout
</button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3 rounded-lg hover:bg-blue-50"
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="bg-blue-600 text-white text-center rounded-lg py-3"
          >
            Register
          </Link>
        </>
      )}

    </div>

  </div>
)}

</>

</div>
</nav>
  );
}

export default Navbar;