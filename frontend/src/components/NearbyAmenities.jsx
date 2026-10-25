import { useState, useMemo } from "react";
import { getNearbyAmenities } from "../utils/nepalUnits";
import {
  MapPin,
  Clock,
  Compass,
  Navigation,
  Sparkles,
  Hospital,
  GraduationCap,
  ShoppingBag,
  Plane,
  Coffee,
  Landmark,
  Building2,
} from "lucide-react";

export default function NearbyAmenities({ city = "Kathmandu", propertyTitle = "" }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const amenities = useMemo(() => {
    return getNearbyAmenities(city);
  }, [city]);

  const categories = useMemo(() => {
    const cats = ["all", ...new Set(amenities.map((a) => a.category))];
    return cats;
  }, [amenities]);

  const filtered = useMemo(() => {
    if (selectedCategory === "all") return amenities;
    return amenities.filter((a) => a.category === selectedCategory);
  }, [amenities, selectedCategory]);

  const getIcon = (iconType) => {
    switch (iconType) {
      case "hospital":
        return <Hospital size={18} className="text-rose-500" />;
      case "school":
        return <GraduationCap size={18} className="text-indigo-500" />;
      case "shopping":
        return <ShoppingBag size={18} className="text-amber-500" />;
      case "plane":
        return <Plane size={18} className="text-sky-500" />;
      case "coffee":
        return <Coffee size={18} className="text-emerald-500" />;
      case "landmark":
        return <Landmark size={18} className="text-purple-500" />;
      case "transit":
        return <Navigation size={18} className="text-blue-500" />;
      default:
        return <Building2 size={18} className="text-slate-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
            <Compass size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Neighborhood & Nearby Amenities
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                {city}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Estimated drive times and walking distances to essential hubs.
            </p>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold capitalize transition cursor-pointer ${
              selectedCategory === cat
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {cat === "all" ? "All Places" : cat}
          </button>
        ))}
      </div>

      {/* Amenities Grid */}
      <div className="grid sm:grid-cols-2 gap-3.5">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 hover:border-slate-200 transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                {getIcon(item.icon)}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block truncate">
                  {item.category}
                </span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {item.name}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 ml-3">
              <span className="inline-block text-xs font-black text-blue-600 dark:text-blue-400">
                {item.distance}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <Clock size={10} />
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
