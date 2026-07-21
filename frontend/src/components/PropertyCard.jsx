import { Link } from "react-router-dom";
function PropertyCard({ property }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
<div className="relative">

  <img
    src={
      property.image
        ? `http://localhost:8000/uploads/${property.image}`
        : "https://placehold.co/600x400?text=No+Image"
    }
    alt={property.title}
    className="w-full h-60 object-cover"
  />

  <span className="absolute top-4 right-4 bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
    {property.property_type}
  </span>

</div>
      <div className="p-5">

        <h3 className="text-xl font-bold">
          {property.title}
        </h3>

        <p className="text-blue-600 font-semibold mt-2">
  🏠 {property.property_type}
</p>

<p className="text-gray-500 mt-1">
  📍 {property.city}
</p>
<div className="flex justify-between mt-4 text-gray-700 text-sm">

  <span>🛏 {property.bedrooms}</span>

  <span>🛁 {property.bathrooms}</span>

  <span>📐 {property.area} sq.ft</span>

</div>

<p className="text-blue-600 font-bold text-2xl mt-4">
  Rs. {Number(property.price).toLocaleString()}
</p>

      <Link
  to={`/properties/${property.id}`}
 className="block mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold text-center"
>
  View Details
</Link>

      </div>

    </div>
  );
}

export default PropertyCard;