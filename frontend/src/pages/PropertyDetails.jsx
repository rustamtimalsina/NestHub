import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPropertyById,
  getPropertyImages,
  getSimilarProperties,
  addFavorite,
  removeFavorite,
  checkFavorite
} from "../services/propertyService";
import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Home,
  User,
  Phone,
  Heart,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
 const [isFavorite, setIsFavorite] = useState(false);
const [showContact, setShowContact] = useState(false);
const [similarProperties, setSimilarProperties] = useState([]);
const [images, setImages] = useState([]);
const [selectedImage, setSelectedImage] = useState("");
useEffect(() => {
    let active = true;

    async function loadProperty() {
      try {
        const data = await getPropertyById(id);
        if (!active) return;
        setProperty(data);
       const propertyImages = await getPropertyImages(id);

if (active) {
 const filteredImages = propertyImages.filter(
  (img) => img.image !== data.image
);

setImages(filteredImages);

setSelectedImage(data.image); 
  }  const similar = await getSimilarProperties(id);
if (active) {
  setSimilarProperties(similar);
}

        try {
          const favorite = await checkFavorite(id);
          if (active) setIsFavorite(favorite);
        } catch {
          // Guests are allowed to view the property without favorite status.
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
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12">
  <div className="max-w-6xl mx-auto px-6">

    <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100">

      <img
       src={
  selectedImage
    ? `http://localhost:8000/uploads/${selectedImage}`
    : property.image
    ? `http://localhost:8000/uploads/${property.image}`
    : "https://placehold.co/1200x600?text=No+Image"
}
        alt={property.title}
        className="w-full h-[520px] object-cover transition duration-700 hover:scale-105"
      />
     {(property.image || images.length > 0) && (
  <div className="flex gap-3 overflow-x-auto p-4 bg-gray-50">

    {/* Cover Image */}
    {property.image && (
      <img
        src={`http://localhost:8000/uploads/${property.image}`}
        alt="Cover"
        onClick={() => setSelectedImage(property.image)}
        className={`w-28 h-20 rounded-lg object-cover cursor-pointer border-4 transition ${
          selectedImage === property.image
            ? "border-blue-600"
            : "border-transparent hover:border-blue-300"
        }`}
      />
    )}

    {/* Gallery Images */}
    {images.map((image) => (
      <img
        key={image.id}
        src={`http://localhost:8000/uploads/${image.image}`}
        alt="Property"
        onClick={() => setSelectedImage(image.image)}
        className={`w-28 h-20 rounded-lg object-cover cursor-pointer border-4 transition ${
          selectedImage === image.image
            ? "border-blue-600"
            : "border-transparent hover:border-blue-300"
        }`}
      />
    ))}

  </div>
)}

      <div className="p-8">

       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">

  <div>

    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
      {property.property_type}
    </span>

   <h1 className="text-5xl font-black text-slate-800">
      {property.title}
    </h1>

   <p className="text-gray-500 text-lg mt-2 flex items-center gap-2">
  <MapPin size={20} className="text-blue-600" />
  {property.city}
</p>

  </div>

  <div className="text-left md:text-right">

    <p className="text-gray-500">
      Price
    </p>

    <h2 className="text-6xl font-black text-blue-600 tracking-tight">
      Rs. {Number(property.price).toLocaleString()}
    </h2>

  </div>

</div>

        <hr className="my-8" />

<div className="mb-8">
<h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
  <FileText className="text-blue-600" />
  Description
</h2>
  <p className="text-gray-700 leading-8 bg-gradient-to-br from-white to-slate-50 border border-gray-100 p-8 rounded-3xl shadow-lg">
  {property.description || "No description available."}
</p>

</div>
 <hr className="my-8" />
<h2 className="text-2xl font-semibold mb-6">
  Property Details
</h2>

<div className="grid grid-cols-2 md:grid-cols-3 gap-5">

  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
   <p className="flex items-center gap-2 text-gray-700 font-medium">
  <BedDouble size={18} className="text-blue-600" />
  Bedrooms
</p>
    <p className="text-2xl font-bold mt-2">
      {property.bedrooms}
    </p>
  </div>

  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <p className="flex items-center gap-2 text-gray-700 font-medium">
  <Bath size={18} className="text-blue-600" />
  Bathrooms
</p>
    <p className="text-2xl font-bold mt-2">
      {property.bathrooms}
    </p>
  </div>

  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <p className="flex items-center gap-2 text-gray-700 font-medium">
  <Ruler size={18} className="text-blue-600" />
  Area
</p>
    <p className="text-2xl font-bold mt-2">
      {property.area} sq.ft
    </p>
  </div>

  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
   <p className="flex items-center gap-2 text-gray-700 font-medium">
  <Home size={18} className="text-blue-600" />
  Property Type
</p>
    <p className="text-xl font-semibold mt-2">
      {property.property_type}
    </p>
  </div>
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
  <p className="flex items-center gap-2 text-gray-700 font-medium">
    📌 Status
  </p>

  <p
    className={`text-xl font-semibold mt-2 ${
      property.status === "Available"
        ? "text-green-600"
        : property.status === "Sold"
        ? "text-red-600"
        : property.status === "Rented"
        ? "text-blue-600"
        : "text-yellow-600"
    }`}
  >
    {property.status}
  </p>
</div>

  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
   <p className="flex items-center gap-2 text-gray-700 font-medium">
  <MapPin size={18} className="text-blue-600" />
  City
</p>
    <p className="text-xl font-semibold mt-2">
      {property.city}
    </p>
  </div>

  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <p className="flex items-center gap-2 text-gray-700 font-medium">
  <User size={18} className="text-blue-600" />
  Owner
</p>
    <p className="text-lg font-semibold mt-2 break-all">
      {property.owner_name}
    </p>
  </div>

</div>
       <div className="mt-10 flex flex-col md:flex-row gap-4">

  <button
  onClick={handleFavorite}
  disabled={property.status !== "Available"}
  className={`flex-1 px-8 py-3 rounded-lg font-semibold text-white transition ${
    property.status !== "Available"
      ? "bg-gray-400 cursor-not-allowed"
      : isFavorite
      ? "bg-red-600 hover:bg-red-700"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  <span className="flex items-center justify-center gap-2">
    <Heart size={20} fill={isFavorite ? "white" : "none"} />

    {property.status !== "Available"
      ? "Not Available"
      : isFavorite
      ? "Remove from Favorites"
      : "Add to Favorites"}
  </span>
</button>
         <button
  onClick={() => {
    if (property.status === "Available") {
      setShowContact(true);
    }
  }}
  disabled={property.status !== "Available"}
  className={`flex-1 py-3 rounded-lg font-semibold transition text-white ${
    property.status === "Available"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-gray-400 cursor-not-allowed"
  }`}
>
  <span className="flex items-center justify-center gap-2">
    <Phone size={20} />

    {property.status === "Available"
      ? "Contact Owner"
      : property.status === "Sold"
      ? "Property Sold"
      : property.status === "Rented"
      ? "Property Rented"
      : "Property Pending"}
  </span>
</button>

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

          <div className="space-y-4">

  <div>
    <p className="text-gray-500 text-sm">
      Owner Name
    </p>

    <p className="font-semibold text-lg">
      {property.owner_name}
    </p>
  </div>

  <div>
    <p className="text-gray-500 text-sm">
      Email
    </p>

    <p className="font-semibold break-all">
      {property.owner_email}
    </p>
  </div>

  <div>
    <p className="text-gray-500 text-sm">
      Phone
    </p>

    <p className="font-semibold">
      {property.owner_phone || "Not Available"}
    </p>
  </div>

</div>

          </div>

         <div className="grid grid-cols-3 gap-3 mt-8">

  {property.owner_phone && (
    <>
      <button
        onClick={() => window.open(`tel:${property.owner_phone}`)}
        className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
      >
        📞 Call
      </button>

      <button
        onClick={() =>
          window.open(
            `https://wa.me/977${property.owner_phone}`,
            "_blank"
          )
        }
        className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition"
      >
        💬 WhatsApp
      </button>
    </>
  )}

  <button
    onClick={() =>
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${property.owner_email}&su=${encodeURIComponent(
          `Inquiry about ${property.title}`
        )}`,
        "_blank"
      )
    }
    className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
  >
    📧 Email
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

  {similarProperties.length > 0 && (
    <>
      <hr className="my-12" />

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-6">
          🏠 Similar Properties
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {similarProperties.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border hover:shadow-xl transition"
            >
              <img
                src={
                  item.image
                    ? `http://localhost:8000/uploads/${item.image}`
                    : "https://placehold.co/600x400?text=No+Image"
                }
                alt={item.title}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">
                <h3 className="text-xl font-bold">
                  {item.title}
                </h3>

                <p className="text-gray-500">
                  📍 {item.city}
                </p>

                <p className="text-blue-600 font-bold text-xl mt-2">
                  Rs. {Number(item.price).toLocaleString()}
                </p>

                <Link
  to={`/properties/${item.id}`}
  className="block mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
>
  View Details
</Link>
              </div>
            </div>
           ))}
        </div>
      </div>
     </>
     )}
   </div>
  </div>
);
}

export default PropertyDetails;

