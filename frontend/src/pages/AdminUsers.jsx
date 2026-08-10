import { useEffect, useState } from "react";
import api from "../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const changeRole = async (userId, currentRole) => {
  const newRole = currentRole === "admin"
    ? "user"
    : "admin";

  try {
    await api.put(
      `/admin/users/${userId}/role?role=${newRole}`
    );

    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === userId
          ? { ...user, role: newRole }
          : user
      )
    );
  } catch (error) {
    console.error("Role change error:", error);

    alert(
      error.response?.data?.detail ||
      "Failed to change user role."
    );
  }
};

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await api.get("/admin/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Users error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">
          Loading users...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          User Management
        </h1>

        <p className="text-gray-500 mt-2">
          Manage NestHub users and their roles.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">
                  Name
                </th>

                <th className="text-left p-4">
                  Email
                </th>

                <th className="text-left p-4">
                  Phone
                </th>

                <th className="text-left p-4">
                  Role
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-semibold">
                    {user.name}
                  </td>

                  <td className="p-4 text-gray-600">
                    {user.email}
                  </td>

                  <td className="p-4 text-gray-600">
                    {user.phone || "No phone"}
                  </td>

                 <td className="p-4">
  <div className="flex items-center gap-3">

    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        user.role === "admin"
          ? "bg-purple-100 text-purple-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {user.role}
    </span>

    <button
      onClick={() => changeRole(user.id, user.role)}
      className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
        user.role === "admin"
          ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
          : "bg-green-100 text-green-700 hover:bg-green-200"
      }`}
    >
      {user.role === "admin"
        ? "Make User"
        : "Make Admin"}
    </button>

  </div>
</td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}

export default AdminUsers;