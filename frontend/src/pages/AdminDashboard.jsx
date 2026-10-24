import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  Users,
  Building,
  Heart,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  MapPin,
  Home,
} from "lucide-react";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await api.get("/admin/dashboard");
        setStats(response.data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <ShieldAlert size={48} className="text-rose-500 mb-3" />
        <h2 className="text-2xl font-bold text-slate-800">Failed to Load Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">
          Unable to fetch admin analytics. Check database connection.
        </p>
      </div>
    );
  }

  const maxCityTotal = Math.max(...stats.properties_by_city.map((c) => c.total), 1);
  const maxTypeTotal = Math.max(...stats.properties_by_type.map((t) => t.total), 1);

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                Administration
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Admin Overview
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Real-time platform activity, property inventory, and user metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/users"
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
            >
              Manage Users
            </Link>
            <Link
              to="/admin/properties"
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition"
            >
              Manage Properties
            </Link>
          </div>
        </div>

        {/* 3 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Registered Users
            </p>
            <h2 className="text-4xl font-black text-slate-900 mt-1">
              {stats.total_users}
            </h2>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <Link to="/admin/users" className="flex items-center gap-1 hover:underline">
                View all users <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Building size={24} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Properties Listed
            </p>
            <h2 className="text-4xl font-black text-slate-900 mt-1">
              {stats.total_properties}
            </h2>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <Link to="/admin/properties" className="flex items-center gap-1 hover:underline">
                Manage listings <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Heart size={24} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total User Favorites
            </p>
            <h2 className="text-4xl font-black text-slate-900 mt-1">
              {stats.total_favorites}
            </h2>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-400">
              Active buyer interest signals
            </div>
          </div>
        </div>

        {/* 2-Column Analytics Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Properties by City */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <MapPin size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Properties by Location
              </h2>
            </div>
            <div className="space-y-4">
              {stats.properties_by_city.length > 0 ? (
                stats.properties_by_city.map((c) => (
                  <div key={c.city} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{c.city}</span>
                      <span className="text-blue-600 font-bold">{c.total} listings</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-700"
                        style={{ width: `${(c.total / maxCityTotal) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No properties data available.</p>
              )}
            </div>
          </div>

          {/* Properties by Type */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <Home size={20} className="text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Properties by Category
              </h2>
            </div>
            <div className="space-y-4">
              {stats.properties_by_type.length > 0 ? (
                stats.properties_by_type.map((t) => (
                  <div key={t.property_type} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{t.property_type}</span>
                      <span className="text-emerald-600 font-bold">{t.total} listings</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-700"
                        style={{ width: `${(t.total / maxTypeTotal) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No properties data available.</p>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Activity: Recent Properties & Recent Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Listings */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Recently Added Listings
            </h2>
            <div className="divide-y divide-slate-100">
              {stats.recent_properties.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to={`/properties/${p.id}`}
                      className="text-sm font-bold text-slate-800 hover:text-blue-600 transition truncate block"
                    >
                      {p.title}
                    </Link>
                    <p className="text-xs text-slate-400 mt-0.5">
                      📍 {p.city} • {p.property_type}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-blue-600">
                      Rs. {Number(p.price).toLocaleString()}
                    </p>
                    <span className="text-[10px] text-slate-400">{p.owner_email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Recently Registered Users
            </h2>
            <div className="divide-y divide-slate-100">
              {stats.recent_users.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{u.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
