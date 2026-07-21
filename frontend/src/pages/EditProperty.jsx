import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPropertyById,
  updateProperty,
} from "../services/propertyService";

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

  useEffect(() => {
    loadProperty();
  }, []);

  async function loadProperty() {
    try {
      const property = await getPropertyById(id);

      setTitle(property.title);
      setDescription(property.description);
      setCity(property.city);
      setPrice(property.price);
      setBedrooms(property.bedrooms);
      setBathrooms(property.bathrooms);
      setArea(property.area);
      setPropertyType(property.property_type);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

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
        image: "",
      });

      alert("Property updated successfully!");

      navigate("/my-properties");
    } catch (error) {
      console.error(error);
      alert("Update failed.");
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        Edit Property
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

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
        <input
          type="number"
          placeholder="Area (sq.ft)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="w-full border p-3 rounded-lg"
        >
          <option>Apartment</option>
          <option>House</option>
          <option>Villa</option>
          <option>Land</option>
          <option>Office</option>
          <option>Commercial</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Save Changes
        </button>

      </form>
    </div>
  );
}

export default EditProperty;