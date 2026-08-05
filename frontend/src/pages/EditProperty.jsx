import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPropertyById,
  updateProperty,
} from "../services/propertyService";
import Swal from "sweetalert2";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

 const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [city, setCity] = useState("");
const [price, setPrice] = useState("");

const [bedrooms, setBedrooms] = useState("");
const [bathrooms, setBathrooms] = useState("");
const [area, setArea] = useState("");
const [propertyType, setPropertyType] = useState("");
const [status, setStatus] = useState("");
const [loading, setLoading] = useState(false);
const [image, setImage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProperty() {
      try {
        const property = await getPropertyById(id);
        if (active) {
          setTitle(property.title);
          setDescription(property.description);
          setCity(property.city);
          setPrice(property.price);
          setBedrooms(property.bedrooms);
          setBathrooms(property.bathrooms);
          setArea(property.area);
          setPropertyType(property.property_type);
          setStatus(property.status);
          setImage(property.image);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadProperty();
    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProperty(id, {
        title,
        description,
        city,
        price,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: Number(area),
        property_type: propertyType,
        status: status,
       image: image,
      });

   setLoading(false);

await Swal.fire({
  icon: "success",
  title: "Success!",
  text: "Property updated successfully.",
  confirmButtonColor: "#2563eb",
});

navigate("/my-properties");
    } catch (error) {
  console.log("STATUS:", error.response?.status);
  console.log("DETAIL:", error.response?.data.detail);

  setLoading(false);

  Swal.fire({
    icon: "error",
    title: "Error!",
    text: "Failed to update property.",
    confirmButtonColor: "#2563eb",
  });
}
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">

  <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-6 sm:p-10">
      <div className="text-center mb-8">

  <h1 className="text-4xl font-bold text-blue-600">
    🏡 NestHub
  </h1>

  <h2 className="text-2xl font-semibold mt-4">
    Edit Property
  </h2>

  <p className="text-gray-500 mt-2">
    Update your property information below.
  </p>

</div>

      <form
  onSubmit={handleSubmit}
  className="space-y-5"
>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

       <div className="grid md:grid-cols-2 gap-5">

  <input
    type="text"
    placeholder="City"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    className="w-full border p-3 rounded-lg"
  />

  <input
    type="number"
    placeholder="Price"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    className="w-full border p-3 rounded-lg"
  />

</div>
        <div className="grid md:grid-cols-2 gap-5">

  <input
    type="number"
    placeholder="Bedrooms"
    value={bedrooms}
    onChange={(e) => setBedrooms(e.target.value)}
    className="w-full border p-3 rounded-lg"
  />

  <input
    type="number"
    placeholder="Bathrooms"
    value={bathrooms}
    onChange={(e) => setBathrooms(e.target.value)}
    className="w-full border p-3 rounded-lg"
  />

</div>
      <div className="grid md:grid-cols-3 gap-5">

  <div>
    <label className="block mb-2 font-medium">
      📐 Area (sq.ft)
    </label>

    <input
      type="number"
      value={area}
      onChange={(e) => setArea(e.target.value)}
      className="w-full border p-3 rounded-lg"
    />
  </div>

  <div>
    <label className="block mb-2 font-medium">
      🏠 Property Type
    </label>

    <select
      value={propertyType}
      onChange={(e) => setPropertyType(e.target.value)}
      className="w-full border p-3 rounded-lg"
    >
      <option value="Apartment">Apartment</option>
      <option value="House">House</option>
      <option value="Villa">Villa</option>
      <option value="Land">Land</option>
      <option value="Office">Office</option>
      <option value="Commercial">Commercial</option>
    </select>
  </div>

  <div>
    <label className="block mb-2 font-medium">
      📌 Property Status
    </label>

    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="w-full border p-3 rounded-lg"
    >
      <option value="Available">Available</option>
      <option value="Sold">Sold</option>
      <option value="Rented">Rented</option>
      <option value="Pending">Pending</option>
    </select>
  </div>

</div>

       <button
  type="submit"
  disabled={loading}
  className={`w-full py-3 rounded-lg font-semibold transition text-white ${
    loading
      ? "bg-blue-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {loading ? "Saving Changes..." : "Save Changes"}
</button>

      </form>
    </div>
    </div>
  );
}

export default EditProperty;
