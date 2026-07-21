import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPropertyById,
  addFavorite,
  removeFavorite,
  checkFavorite
} from "../services/propertyService";

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
 const [isFavorite, setIsFavorite] = useState(false);
const [showContact, setShowContact] = useState(false);
  useEffect(() => {
    loadProperty();
  }, []);

async function loadProperty() {
  try {
    const data = await getPropertyById(id);
    setProperty(data);

    try {
      const favorite = await checkFavorite(id);
      setIsFavorite(favorite);
    } catch (error) {
      // User may not be logged in, so just ignore this.
    }

  } catch (error) {
    console.error(error);
  }
}
async function handleFavorite() {
  try {
    if (isFavorite) {
      const data = await removeFavorite(property.id);

      alert(data.message);

      setIsFavorite(false);

    } else {

      const data = await addFavorite(property.id);

      alert(data.message);

      setIsFavorite(true);
    }

  } catch (error) {

    console.error(error);

    alert("Please login first.");

  }
}

  if (!property) {
    return (
      <h1 className="text-center text-2xl mt-20">
        Loading...
      </h1>
    );
  }

return (
  <div className="max-w-6xl mx-auto py-12 px-6">

    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

      <img
        src={
          property.image
            ? `http://localhost:8000/uploads/${property.image}`
            : "https://placehold.co/1200x600?text=No+Image"
        }
        alt={property.title}
        className="w-full h-[400px] object-cover"
      />

      <div className="p-8">

       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">

  <div>

    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
      {property.property_type}
    </span>

    <h1 className="text-4xl font-bold">
      {property.title}
    </h1>

    <p className="text-gray-500 text-lg mt-2">
      📍 {property.city}
    </p>

  </div>

  <div className="text-left md:text-right">

    <p className="text-gray-500">
      Price
    </p>

    <h2 className="text-5xl font-extrabold text-blue-600">
      Rs. {Number(property.price).toLocaleString()}
    </h2>

  </div>

</div>

        <hr className="my-8" />

<div className="mb-8">

  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
  📄 Description
</h2>

  <p className="text-gray-700 leading-8 bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
  {property.description || "No description available."}
</p>

</div>
 <hr className="my-8" />
<h2 className="text-2xl font-semibold mb-6">
  Property Details
</h2>

<div className="grid grid-cols-2 md:grid-cols-3 gap-5">

  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <p className="text-gray-700 font-medium">🛏 Bedrooms</p>
    <p className="text-2xl font-bold mt-2">
      {property.bedrooms}
    </p>
  </div>

  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <p className="text-gray-700 font-medium">🛁 Bathrooms</p>
    <p className="text-2xl font-bold mt-2">
      {property.bathrooms}
    </p>
  </div>

  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <p className="text-gray-700 font-medium">📐 Area</p>
    <p className="text-2xl font-bold mt-2">
      {property.area} sq.ft
    </p>
  </div>

  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <p className="text-gray-700 font-medium">🏠 Property Type</p>
    <p className="text-xl font-semibold mt-2">
      {property.property_type}
    </p>
  </div>

  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <p className="text-gray-700 font-medium">📍 City</p>
    <p className="text-xl font-semibold mt-2">
      {property.city}
    </p>
  </div>

  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <p className="text-gray-700 font-medium">👤 Owner</p>
    <p className="text-lg font-semibold mt-2 break-all">
      {property.owner_email}
    </p>
  </div>

</div>
       <div className="mt-10 flex flex-col md:flex-row gap-4">

         <button
  onClick={handleFavorite}
  className={`flex-1 px-8 py-3 rounded-lg font-semibold text-white transition ${  
  isFavorite
      ? "bg-red-600 hover:bg-red-700"
      : "bg-blue-600 hover:bg-blue-700"
   }`}
>
  {isFavorite
    ? "❤️ Remove from Favorites"
    : "🤍 Add to Favorites"}
</button>
          <button
  onClick={() => setShowContact(true)}
  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
>
  📞 Contact Owner
</button>

        </div>

      </div>

      </div>

    {showContact && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

          <h2 className="text-3xl font-bold mb-6 text-center">
            📞 Contact Owner
          </h2>

          <div className="space-y-4">

            <div>
              <p className="text-gray-500 text-sm">
                Property
              </p>

              <p className="font-semibold text-lg">
                {property.title}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Owner Email
              </p>

              <p className="font-semibold break-all">
                {property.owner_email}
              </p>
            </div>

          </div>

          <div className="flex gap-3 mt-8">

     <button
  onClick={() =>
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${property.owner_email}`,
      "_blank"
    )
  }
  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-center font-semibold transition"
>
  📧 Send Email
</button>

            <button
              onClick={() => navigator.clipboard.writeText(property.owner_email)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-xl font-semibold transition"
            >
              📋 Copy Email
            </button>

          </div>

          <button
            onClick={() => setShowContact(false)}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Close
          </button>

        </div>

      </div>
    )}

  </div>
);
}
export default PropertyDetails;