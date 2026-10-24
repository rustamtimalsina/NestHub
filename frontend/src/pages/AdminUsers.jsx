import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { Users, Shield, UserCheck, Phone, Mail } from "lucide-react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const changeRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    try {
      await api.put(`/admin/users/${userId}/role?role=${newRole}`);

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.success(`User role changed to ${newRole.toUpperCase()}!`);
    } catch (error) {
      console.error("Role change error:", error);
      toast.error(
        error.response?.data?.detail || "Failed to change user role."
      );
    }
  };

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await api.get("/admin/users");
        setUsers(response.data || []);
      } catch (error) {
        console.error("Users error:", error);
        toast.error("Failed to load users list.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
            User Administration
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            User Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View registered user profiles, permissions, and toggle administrator roles.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xs border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Contact Email</th>
                  <th className="py-4 px-6">Phone Number</th>
                  <th className="py-4 px-6">Current Role</th>
                  <th className="py-4 px-6 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                          {u.name ? u.name[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <span className="text-xs text-slate-400">ID #{u.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Mail size={15} className="text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Phone size={15} className="text-slate-400" />
                        <span>{u.phone || "Not provided"}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => changeRole(u.id, u.role)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                          u.role === "admin"
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                        }`}
                      >
                        {u.role === "admin" ? "Demote to User" : "Promote to Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
