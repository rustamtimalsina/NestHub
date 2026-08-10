import { useEffect, useState } from "react";
import api from "../services/api";

function AdminProperties() {
  const [properties, setProperties] = useState([]);
const [loading, setLoading] = useState(true);
const [editingProperty, setEditingProperty] = useState(null);
  useEffect(() => {
    async function loadProperties() {
      try {
        const response = await api.get("/admin/properties");
        setProperties(response.data);
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);
  async function handleDelete(propertyId) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this property?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await api.delete(`/admin/properties/${propertyId}`);

    setProperties((currentProperties) =>
      currentProperties.filter(
        (property) => property.id !== propertyId
      )
    );
  } catch (error) {
    console.error("Failed to delete property:", error);
    alert("Failed to delete property.");
  }
}
function handleEdit(property) {
  setEditingProperty(property);
}
async function handleSaveEdit() {
  try {
    await api.put(
      `/admin/properties/${editingProperty.id}`,
      editingProperty
    );

    setProperties((currentProperties) =>
      currentProperties.map((property) =>
        property.id === editingProperty.id
          ? editingProperty
          : property
      )
    );

    setEditingProperty(null);

    alert("Property updated successfully!");
  } catch (error) {
    console.error("Failed to update property:", error);
    alert("Failed to update property.");
  }
}

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Property Management
      </h1>

      <p className="text-gray-500 mt-2 mb-8">
        Manage all properties on NestHub.
      </p>
{editingProperty && (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
    <h2 className="text-2xl font-bold mb-6">
      Edit Property
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <input
        type="text"
        value={editingProperty.title}
        onChange={(e) =>
          setEditingProperty({
            ...editingProperty,
            title: e.target.value,
          })
        }
        placeholder="Title"
        className="border rounded-lg p-3"
      />

      <input
        type="text"
        value={editingProperty.city}
        onChange={(e) =>
          setEditingProperty({
            ...editingProperty,
            city: e.target.value,
          })
        }
        placeholder="City"
        className="border rounded-lg p-3"
      />

      <input
        type="number"
        value={editingProperty.price}
        onChange={(e) =>
          setEditingProperty({
            ...editingProperty,
            price: Number(e.target.value),
          })
        }
        placeholder="Price"
        className="border rounded-lg p-3"
      />

      <input
        type="text"
        value={editingProperty.property_type}
        onChange={(e) =>
          setEditingProperty({
            ...editingProperty,
            property_type: e.target.value,
          })
        }
        placeholder="Property Type"
        className="border rounded-lg p-3"
      />

    </div>

    <div className="flex gap-3 mt-6">
     <button
  onClick={handleSaveEdit}
  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
>
  Save Changes
</button>

      <button
        onClick={() => setEditingProperty(null)}
        className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg"
      >
        Cancel
      </button>
    </div>
  </div>
)}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">City</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Owner</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {properties.map((property) => (
              <tr
                key={property.id}
                className="border-t"
              >
                <td className="p-4 font-medium">
                  {property.title}
                </td>

                <td className="p-4">
                  {property.city}
                </td>

                <td className="p-4">
                  Rs. {property.price}
                </td>

                <td className="p-4">
                  {property.property_type}
                </td>

                <td className="p-4">
                  {property.owner_name}
                </td>

                <td className="p-4">
                  {property.status}
                </td>
                <td className="p-4">
                 <div className="flex gap-2">
  <button
    onClick={() => handleEdit(property)}
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
  >
    Edit
  </button>

  <button
    onClick={() => handleDelete(property.id)}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
  >
    Delete
  </button>
</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProperties;