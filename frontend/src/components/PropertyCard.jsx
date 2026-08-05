import { Link } from "react-router-dom";
import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";
function PropertyCard({ property }) {
  return (
   <motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  whileHover={{ y: -8 }}
  className="group bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500"
>
<div className="relative">

 <img
  src={
    property.image
      ? `http://localhost:8000/uploads/${property.image}`
      : "https://placehold.co/600x400?text=No+Image"
  }
  alt={property.title}
 className="w-full h-52 sm:h-60 object-cover transition-transform duration-500 group-hover:scale-110"
/>

  <span className="absolute top-4 right-4 bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
    {property.property_type}
  </span>
  <span
  className={`absolute top-4 left-4 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg
    ${
      property.status === "Available"
        ? "bg-green-600"
        : property.status === "Sold"
        ? "bg-red-600"
        : property.status === "Rented"
        ? "bg-blue-600"
        : "bg-yellow-500"
    }`}
>
  {property.status}
</span>

</div>
      <div className="p-5">

        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition">
          {property.title}
        </h3>

        <p className="text-blue-600 font-semibold mt-2 flex items-center gap-2">
  <Home size={18} />
  {property.property_type}
</p>

<p className="text-gray-500 mt-1 flex items-center gap-2">
  <MapPin size={18} />
  {property.city}
</p>
<div className="flex justify-between mt-5 text-gray-700">

  <span className="flex items-center gap-1">
    <BedDouble size={18} />
    {property.bedrooms}
  </span>

  <span className="flex items-center gap-1">
    <Bath size={18} />
    {property.bathrooms}
  </span>

  <span className="flex items-center gap-1">
    <Ruler size={18} />
    {property.area} sq.ft
  </span>

</div>

<p className="text-blue-600 font-extrabold text-2xl sm:text-3xl mt-5">
  Rs. {Number(property.price).toLocaleString()}
</p>
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.97 }}
>
  <Link
    to={`/properties/${property.id}`}
    className="block mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl text-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
  >
    View Details
  </Link>
</motion.div>

      </div>

   </motion.div>
  );
}

export default PropertyCard;