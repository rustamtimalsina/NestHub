import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyProperties,
  deleteProperty,
} from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";


function MyProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    loadMyProperties();
  }, []);

  async function loadMyProperties() {
    try {
      const data = await getMyProperties();
      setProperties(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(propertyId) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this property?"
  );

  if (!confirmDelete) return;

  try {
    const data = await deleteProperty(propertyId);

    alert(data.message);

    loadMyProperties(); // Refresh the list
  } catch (error) {
    console.error(error);
    alert("Failed to delete property.");
  }
}

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="flex justify-between items-center mb-10">

  <div>

    <h1 className="text-4xl font-bold">
      My Properties
    </h1>

    <p className="text-gray-500 mt-2">
      Manage all the properties you've listed.
    </p>

  </div>

  <button
    onClick={() => navigate("/add-property")}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
  >
    + Add Property
  </button>

</div>

      {properties.length === 0 ? (
        <div className="text-center py-24">

  <h2 className="text-3xl font-bold mb-4">
    No Properties Yet
  </h2>

  <p className="text-gray-500 mb-8">
    Start by listing your first property.
  </p>

  <button
    onClick={() => navigate("/add-property")}
    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
  >
    Add Your First Property
  </button>

</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">

       {properties.map((property) => (
  <div key={property.id}>

    <PropertyCard property={property} />

    <div className="flex gap-3 mt-3">

      <button
  onClick={() => navigate(`/edit-property/${property.id}`)}
 className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold transition"
>
  ✏️ Edit
      </button>

      <button
        onClick={() => handleDelete(property.id)}
        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
      >
        🗑 Delete
      </button>

    </div>

  </div>
))}

        </div>
      )}

    </div>
  );
}

export default MyProperties;