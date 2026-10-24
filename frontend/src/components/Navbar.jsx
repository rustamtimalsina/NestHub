import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  House,
  Building2,
  Heart,
  PlusCircle,
  CircleUserRound,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Compass,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-600 shadow-xs"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-8 h-20">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-2xl font-black text-slate-900 tracking-tight group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <House size={22} />
          </div>
          <span className="font-extrabold tracking-tight">
            Nest<span className="text-blue-600">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5">
          <NavLink to="/" className={navLinkClasses}>
            Home
          </NavLink>

          <NavLink to="/properties" className={navLinkClasses}>
            <Compass size={17} />
            Explore
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/favorites" className={navLinkClasses}>
                <Heart size={17} />
                Favorites
              </NavLink>

              <NavLink to="/my-properties" className={navLinkClasses}>
                <Building2 size={17} />
                My Listings
              </NavLink>

              <NavLink
                to="/add-property"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
              >
                <PlusCircle size={17} />
                List Property
              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
                >
                  <ShieldCheck size={17} />
                  Admin
                </NavLink>
              )}
            </>
          )}
        </nav>

        {/* Desktop User Section */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2.5 py-1.5 px-3 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {user?.name?.split(" ")[0] || "User"}
                  </p>
                  <span className="text-[10px] font-semibold text-slate-400 capitalize">
                    {user?.role || "Member"}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 text-sm font-semibold rounded-2xl bg-slate-900 text-white hover:bg-blue-600 shadow-md transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Buttons */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            className="p-2 rounded-xl text-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-6 shadow-xl space-y-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 font-semibold hover:bg-blue-50 transition"
          >
            <House size={20} />
            Home
          </Link>

          <Link
            to="/properties"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 font-semibold hover:bg-blue-50 transition"
          >
            <Compass size={20} />
            Explore Properties
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/favorites"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 font-semibold hover:bg-blue-50 transition"
              >
                <Heart size={20} />
                Favorites
              </Link>

              <Link
                to="/my-properties"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 font-semibold hover:bg-blue-50 transition"
              >
                <Building2 size={20} />
                My Listings
              </Link>

              <Link
                to="/add-property"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-blue-600 font-semibold bg-blue-50 transition"
              >
                <PlusCircle size={20} />
                List a Property
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-purple-700 font-semibold bg-purple-50 transition"
                >
                  <ShieldCheck size={20} />
                  Admin Dashboard
                </Link>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 text-slate-700 font-semibold"
                >
                  <CircleUserRound size={22} className="text-blue-600" />
                  <span>{user?.name || "My Profile"}</span>
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-1 text-sm font-semibold text-rose-600 px-3 py-1.5 rounded-xl hover:bg-rose-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-center py-3 rounded-2xl border border-slate-200 text-slate-700 font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="text-center py-3 rounded-2xl bg-blue-600 text-white font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
