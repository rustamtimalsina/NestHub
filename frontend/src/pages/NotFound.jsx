import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="text-center max-w-lg">
        <span className="text-8xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          404
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 mt-4">
          Property or Page Not Found
        </h1>
        <p className="text-slate-500 mt-3 text-base leading-relaxed">
          The property or page you are looking for may have been moved, sold, or is no longer listed.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            to="/"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <Link
            to="/properties"
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-semibold transition"
          >
            <ArrowLeft size={18} />
            Explore Properties
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
