import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  Trash2,
  Edit3,
  ExternalLink,
  X,
  Save,
  CheckCircle,
  Building,
} from "lucide-react";
import { getImageUrl } from "../utils/imageUrl";

const API_URL = import.meta.env.VITE_API_URL;

function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProperties() {
      try {
        const response = await api.get("/admin/properties");
        setProperties(response.data || []);
      } catch (error) {
        console.error("Failed to load properties:", error);
        toast.error("Failed to load properties list.");
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  async function handleDelete(propertyId) {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) {
      return;
    }

    try {
      await api.delete(`/admin/properties/${propertyId}`);
      setProperties((current) => current.filter((p) => p.id !== propertyId));
      toast.success("Property deleted successfully.");
    } catch (error) {
      console.error("Failed to delete property:", error);
      toast.error("Failed to delete property.");
    }
  }

  function handleEdit(property) {
    setEditingProperty({ ...property });
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/admin/properties/${editingProperty.id}`, {
        title: editingProperty.title,
        city: editingProperty.city,
        price: Number(editingProperty.price),
        property_type: editingProperty.property_type,
        status: editingProperty.status,
      });

      setProperties((current) =>
        current.map((p) =>
          p.id === editingProperty.id ? { ...p, ...editingProperty } : p
        )
      );

      setEditingProperty(null);
      toast.success("Listing updated successfully!");
    } catch (error) {
      console.error("Failed to update property:", error);
      toast.error(error.response?.data?.detail || "Failed to update property.");
    } finally {
      setSaving(false);
    }
  }

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
            Listing Control
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Property Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review, edit status, or moderate all property listings across the platform.
          </p>
        </div>

        {/* Edit Modal */}
        {editingProperty && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Quick Edit Listing #{editingProperty.id}
                </h2>
                <button
                  onClick={() => setEditingProperty(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 mt-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProperty.title || ""}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, title: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProperty.city || ""}
                      onChange={(e) =>
                        setEditingProperty({ ...editingProperty, city: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Price (NPR)
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProperty.price || ""}
                      onChange={(e) =>
                        setEditingProperty({
                          ...editingProperty,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Property Type
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProperty.property_type || ""}
                      onChange={(e) =>
                        setEditingProperty({
                          ...editingProperty,
                          property_type: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Status
                    </label>
                    <select
                      value={editingProperty.status || "Available"}
                      onChange={(e) =>
                        setEditingProperty({ ...editingProperty, status: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="Available">Available</option>
                      <option value="Sold">Sold</option>
                      <option value="Rented">Rented</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition shadow-sm"
                  >
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProperty(null)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Property</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Owner</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(API_URL, p.image)}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/properties/${p.id}`}
                            className="font-bold text-slate-800 hover:text-blue-600 transition truncate block max-w-xs"
                          >
                            {p.title}
                          </Link>
                          <span className="text-xs text-slate-400">{p.property_type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">
                      {p.city}
                    </td>
                    <td className="py-4 px-6 font-bold text-blue-600">
                      Rs. {Number(p.price).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs">
                      <p className="font-semibold text-slate-700">{p.owner_name || "Owner"}</p>
                      <p>{p.owner_email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                          p.status === "Available"
                            ? "bg-emerald-50 text-emerald-700"
                            : p.status === "Sold"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {p.status || "Available"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition"
                        title="Edit Property"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Delete Property"
                      >
                        <Trash2 size={16} />
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

export default AdminProperties;
