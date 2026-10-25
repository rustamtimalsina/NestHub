import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Heart,
  ExternalLink,
  Scale,
} from "lucide-react";
import { motion } from "framer-motion";
import { getImageUrl } from "../utils/imageUrl";
import { addFavorite, removeFavorite } from "../services/propertyService";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";
import { toast } from "react-toastify";
import { formatNepaliPrice, sqftToRopani } from "../utils/nepalUnits";

const API_URL = import.meta.env.VITE_API_URL;

function PropertyCard({ property, onFavoriteToggle, initialFavorite = false }) {
  const { isAuthenticated } = useAuth();
  const { addToCompare, isInCompare } = useCompare();
  const [isFav, setIsFav] = useState(initialFavorite);
  const [favLoading, setFavLoading] = useState(false);

  const compared = isInCompare(property.id);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please login to save properties to your favorites.");
      return;
    }

    setFavLoading(true);
    try {
      if (isFav) {
        await removeFavorite(property.id);
        setIsFav(false);
        toast.info("Removed from favorites");
      } else {
        await addFavorite(property.id);
        setIsFav(true);
        toast.success("Added to favorites ❤️");
      }
      if (onFavoriteToggle) {
        onFavoriteToggle(property.id, !isFav);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not update favorite status");
    } finally {
      setFavLoading(false);
    }
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(property);
  };

  const statusColor = {
    Available: "bg-emerald-500/90 text-white",
    Sold: "bg-rose-500/90 text-white",
    Rented: "bg-blue-500/90 text-white",
    Pending: "bg-amber-500/90 text-white",
  }[property.status] || "bg-slate-700/90 text-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100/90 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={getImageUrl(API_URL, property.image)}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges & Actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          <span
            className={`text-xs font-bold tracking-wide uppercase px-3 py-1 rounded-full backdrop-blur-md shadow-sm ${statusColor}`}
          >
            {property.status || "Available"}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Compare Button */}
            <button
              onClick={handleCompareClick}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                compared
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-white/85 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white hover:text-blue-600"
              }`}
              title={compared ? "In Comparison" : "Add to Compare"}
            >
              <Scale size={16} />
            </button>

            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              disabled={favLoading}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                isFav
                  ? "bg-rose-500 text-white scale-105"
                  : "bg-white/85 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white hover:text-rose-500"
              }`}
              title={isFav ? "Remove Favorite" : "Add to Favorites"}
            >
              <Heart size={16} className={`${isFav ? "fill-white" : ""}`} />
            </button>
          </div>
        </div>

        {/* Property Type Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-black/40 text-white backdrop-blur-md border border-white/20">
            {property.property_type}
          </span>
        </div>

        {/* Price Tag in Image Banner */}
        <div className="absolute bottom-3 right-3 text-right">
          <p className="text-lg font-black text-white drop-shadow-md">
            {formatNepaliPrice(property.price)}
          </p>
          <p className="text-[10px] font-semibold text-white/80 drop-shadow">
            Rs. {Number(property.price).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <Link to={`/properties/${property.id}`}>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {property.title}
            </h3>
          </Link>

          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 flex items-center gap-1.5">
            <MapPin size={16} className="text-blue-500 flex-shrink-0" />
            <span className="line-clamp-1">{property.city}</span>
          </p>
        </div>

        {/* Specs Row with Nepali Area Units */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-medium text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-bold">
              <BedDouble size={14} className="text-blue-500" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <span className="text-[10px] text-slate-400">Rooms</span>
          </div>
          <div className="flex flex-col items-center justify-center border-x border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-bold">
              <Bath size={14} className="text-blue-500" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <span className="text-[10px] text-slate-400">Fitted</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-bold">
              <Maximize2 size={13} className="text-blue-500" />
              <span>{property.area} sqft</span>
            </div>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[90px]">
              {sqftToRopani(property.area).label}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/properties/${property.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-white font-semibold text-sm transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <span>View Property</span>
          <ExternalLink size={15} />
        </Link>
      </div>
    </motion.div>
  );
}

export default PropertyCard;
