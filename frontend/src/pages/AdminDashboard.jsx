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
  <div key={city.city} className="mb-5">

    <div className="flex justify-between mb-2">
      <span className="font-medium text-gray-700">
        {city.city}
      </span>

      <span className="font-semibold text-blue-600">
        {city.total}
      </span>
    </div>

    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className="bg-blue-600 h-3 rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(
            (city.total / Math.max(...stats.properties_by_city.map(c => c.total))) * 100,
            100
          )}%`
        }}
      />
    </div>

  </div>
))}
    </div>
  </div>
  {/* Properties by Type */}
<div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
  <h2 className="text-2xl font-bold mb-6">
    Properties by Type
  </h2>

  <div className="space-y-5">
    {stats.properties_by_type.map((type) => (
      <div key={type.property_type}>

        <div className="flex justify-between mb-2">
          <span className="font-medium text-gray-700">
            {type.property_type}
          </span>

          <span className="font-semibold text-green-600">
            {type.total}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(
                (type.total /
                  Math.max(
                    ...stats.properties_by_type.map(
                      (t) => t.total
                    )
                  )) *
                  100,
                100
              )}%`
            }}
          />
        </div>

      </div>
    ))}
  </div>
</div>
{/* Recent Properties */}
<div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
  <h2 className="text-2xl font-bold mb-6">
    Recent Properties
  </h2>

  <div className="space-y-4">
    {stats.recent_properties.map((property) => (
      <div
        key={property.id}
        className="border rounded-xl p-4 hover:shadow-md transition"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {property.title}
            </h3>

            <p className="text-gray-500 mt-1">
              📍 {property.city}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {property.property_type}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-xl font-bold text-green-600">
              Rs. {property.price.toLocaleString()}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Owner: {property.owner_email}
            </p>
          </div>

        </div>
      </div>
    ))}
  </div>
</div>
{/* Recent Users */}
<div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
  <h2 className="text-2xl font-bold mb-6">
    Recent Users
  </h2>

  <div className="space-y-4">
    {stats.recent_users.map((user) => (
      <div
        key={user.id}
        className="border rounded-xl p-4 hover:shadow-md transition"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {user.name}
            </h3>

            <p className="text-gray-500 mt-1">
              {user.email}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              📞 {user.phone || "No phone"}
            </p>
          </div>

          <div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                user.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {user.role}
            </span>
          </div>

        </div>
      </div>
    ))}
  </div>
</div>

</div>

    </div>
  );
}

export default AdminDashboard;