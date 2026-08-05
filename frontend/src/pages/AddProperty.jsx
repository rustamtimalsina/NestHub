import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadImage, createProperty } from "../services/propertyService";

function AddProperty() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [status, setStatus] = useState("Available");
  const [image, setImage] = useState(null);
  
const [preview, setPreview] = useState(null);
const [loading, setLoading] = useState(false);

const navigate = useNavigate();
async function handleSubmit(e) {
  e.preventDefault();

  if (!image) {
    toast.error("Please select a property image.");
    return;
  }

  setLoading(true);

  try {
    const filename = await uploadImage(image);

    await createProperty({
      title,
      description,
      city,
      price: Number(price),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      property_type: propertyType,
      status: status,
      image: filename,
    });

   toast.success("Property added successfully!");

setLoading(false);

setTimeout(() => {
  navigate("/my-properties");
}, 1000);

  } catch (error) {
  setLoading(false);

  console.error(error);
  toast.error("Failed to add property.");
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
          Add New Property
        </h2>

        <p className="text-gray-500 mt-2">
          Fill in the details below to list your property.
        </p>

      </div>

     <form
  onSubmit={handleSubmit}
  className="space-y-5"
>

        <div>
          <label className="block mb-2 font-medium">
            Property Title
          </label>

          <input
            type="text"
            placeholder="Luxury Apartment"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
  <label className="block mb-2 font-medium">
    Description
  </label>

  <textarea
    rows="4"
    placeholder="Describe your property..."
    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />
</div>

       <div className="grid md:grid-cols-2 gap-5">

  <div>

    <label className="block mb-2 font-medium">
      City
    </label>

    <input
      type="text"
      placeholder="Kathmandu"
      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      value={city}
      onChange={(e) => setCity(e.target.value)}
    />

  </div>

  <div>

    <label className="block mb-2 font-medium">
      Price (Rs.)
    </label>

    <input
      type="number"
      placeholder="25000000"
      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
    />

  </div>

</div>
          <div className="grid grid-cols-2 gap-4">

  <div>
    <label className="block mb-2 font-medium">
      🛏 Bedrooms
    </label>

    <input
      type="number"
      min="0"
      className="w-full border border-gray-300 rounded-lg p-3"
      value={bedrooms}
      onChange={(e) => setBedrooms(e.target.value)}
    />
  </div>

  <div>
    <label className="block mb-2 font-medium">
      🛁 Bathrooms
    </label>

    <input
      type="number"
      min="0"
      className="w-full border border-gray-300 rounded-lg p-3"
      value={bathrooms}
      onChange={(e) => setBathrooms(e.target.value)}
    />
  </div>

</div>

<div className="grid md:grid-cols-3 gap-5">

  <div>
    <label className="block mb-2 font-medium">
      📐 Area (sq.ft)
    </label>

    <input
      type="number"
      min="1"
      className="w-full border border-gray-300 rounded-lg p-3"
      value={area}
      onChange={(e) => setArea(e.target.value)}
    />
  </div>

  <div>
    <label className="block mb-2 font-medium">
      🏠 Property Type
    </label>

    <select
      className="w-full border border-gray-300 rounded-lg p-3"
      value={propertyType}
      onChange={(e) => setPropertyType(e.target.value)}
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
      className="w-full border border-gray-300 rounded-lg p-3"
      value={status}
      onChange={(e) => setStatus(e.target.value)}
    >
      <option value="Available">Available</option>
      <option value="Sold">Sold</option>
      <option value="Rented">Rented</option>
      <option value="Pending">Pending</option>
    </select>
  </div>
</div>

        <div>

          <label className="block mb-2 font-medium">
            Property Image
          </label>

          <label className="flex items-center justify-center w-full h-36 border-2 border-dashed border-blue-400 rounded-xl cursor-pointer hover:bg-blue-50 transition">

           <div className="text-center">

  <p className="text-5xl">
    {image ? "✅" : "📷"}
  </p>

  <p className="mt-2 text-gray-600">

    {image
      ? image.name
      : "Click to upload an image"}

  </p>

</div>

           <input
  type="file"
  className="hidden"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }}
/>

          </label>

        </div>
{preview && (
  <div className="mt-6">
    <img
      src={preview}
      alt="Preview"
      className="w-full h-64 object-cover rounded-xl shadow"
    />
  </div>
)}
        <button
  type="submit"
  disabled={loading}
  className={`w-full py-3 rounded-lg font-semibold text-lg transition text-white ${
    loading
      ? "bg-blue-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {loading ? "Adding Property..." : "Add Property"}
</button>

      </form>

    </div>

  </div>
  );
}

export default AddProperty;
