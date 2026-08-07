import { useEffect, useState } from "react";
import api from "../services/api";

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold">
          Failed to load dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage and monitor your NestHub platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500">
            Total Users
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-2">
            {stats.total_users}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500">
            Total Properties
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {stats.total_properties}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-500">
            Total Favorites
          </p>

          <h2 className="text-4xl font-bold text-red-600 mt-2">
            {stats.total_favorites}
          </h2>
         </div>

  {/* Properties by City */}
  <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
    <h2 className="text-2xl font-bold mb-6">
      Properties by City
    </h2>

    <div className="space-y-4">
      {stats.properties_by_city.map((city) => (
        <div
          key={city.city}
          className="flex items-center justify-between border-b pb-3"
        >
          <span className="font-medium text-gray-700">
            {city.city}
          </span>

          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-semibold">
            {city.total}
          </span>
        </div>
      ))}
    </div>
  </div>

</div>

    </div>
  );
}

export default AdminDashboard;